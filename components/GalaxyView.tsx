
import React, { useEffect, useState, useRef } from 'react';
import { TalentProfile, Language } from '../types';
import { DEPT_TRANSLATIONS, ROLE_TRANSLATIONS } from '../data/mockData';
import { Bot } from 'lucide-react';

interface Props {
  roster: TalentProfile[];
  onSelectProfile: (id: string) => void;
  language: Language;
}

interface Node extends TalentProfile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number; // For organic floating
  floatSpeed: number; // Individual float speed
}

const GalaxyView: React.FC<Props> = ({ roster, onSelectProfile, language }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Config
  const REPULSION = 12000; 
  const CENTER_PULL = 0.015; 
  const DAMPING = 0.94; 
  const CLUSTER_STRENGTH = 0.08; 

  // Department Colors
  const deptColors: { [key: string]: string } = {
    'Engineering': '#06b6d4', // Cyan
    'Design': '#d946ef', // Fuchsia
    'Product': '#facc15', // Yellow
    'AI Research': '#22c55e', // Green
    'Marketing': '#f43f5e', // Rose
    'Operations': '#94a3b8', // Slate
    'Agent': '#6366f1', // Indigo for Agents
  };

  // 1. Update Dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Initialize Nodes (Deterministic + Pre-warm)
  useEffect(() => {
    if (dimensions.width === 0 || roster.length === 0) return;
    
    // Only re-init if nodes array is empty or length changed
    if (nodes.length === 0 || nodes.length !== roster.length) {
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;

        // A. Deterministic Placement (Golden Spiral)
        let tempNodes = roster.map((p, i) => {
            const angle = i * 2.39996; 
            const radius = 60 + 25 * i; 
            
            return {
                ...p,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                vx: 0,
                vy: 0,
                phase: Math.random() * Math.PI * 2,
                floatSpeed: 0.005 + Math.random() * 0.01
            };
        });

        // B. Pre-warm Physics (Run 150 iterations in memory)
        for (let tick = 0; tick < 150; tick++) {
            tempNodes = tempNodes.map((node, i) => {
                let { x, y, vx, vy } = node;

                // Repulsion
                for (let j = 0; j < tempNodes.length; j++) {
                    if (i === j) continue;
                    const other = tempNodes[j];
                    const dx = x - other.x;
                    const dy = y - other.y;
                    const distSq = dx * dx + dy * dy;
                    const dist = Math.sqrt(distSq);
                    
                    if (dist > 0) {
                        const force = REPULSION / (distSq + 600); 
                        vx += (dx / dist) * force;
                        vy += (dy / dist) * force;
                    }
                }

                // Center + Cluster Gravity
                vx += (centerX - x) * CENTER_PULL;
                vy += (centerY - y) * CENTER_PULL;

                const sameDeptNodes = tempNodes.filter(n => n.department === node.department);
                if (sameDeptNodes.length > 0) {
                    const avgX = sameDeptNodes.reduce((sum, n) => sum + n.x, 0) / sameDeptNodes.length;
                    const avgY = sameDeptNodes.reduce((sum, n) => sum + n.y, 0) / sameDeptNodes.length;
                    vx += (avgX - x) * CLUSTER_STRENGTH;
                    vy += (avgY - y) * CLUSTER_STRENGTH;
                }

                vx *= DAMPING;
                vy *= DAMPING;
                x += vx;
                y += vy;
                
                // Hard Bounds Pre-warm
                if (x < 50) x = 50;
                if (x > dimensions.width - 50) x = dimensions.width - 50;
                if (y < 50) y = 50;
                if (y > dimensions.height - 50) y = dimensions.height - 50;

                return { ...node, x, y, vx, vy };
            });
        }

        setNodes(tempNodes);
    }
  }, [roster, dimensions.width]);

  // 3. Live Physics Simulation Loop
  useEffect(() => {
    if (nodes.length === 0 || dimensions.width === 0) return;

    let animationFrameId: number;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    let globalTime = 0;

    const tick = () => {
      globalTime += 1;

      setNodes(prevNodes => {
        return prevNodes.map((node, i) => {
          let { x, y, vx, vy } = node;
          
          // A. Standard Physics (Forces)
          for (let j = 0; j < prevNodes.length; j++) {
            if (i === j) continue;
            const other = prevNodes[j];
            const dx = x - other.x;
            const dy = y - other.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            if (dist > 0) {
              const force = REPULSION / (distSq + 200); 
              vx += (dx / dist) * force;
              vy += (dy / dist) * force;
            }
          }

          vx += (centerX - x) * CENTER_PULL;
          vy += (centerY - y) * CENTER_PULL;

          const sameDeptNodes = prevNodes.filter(n => n.department === node.department);
          if (sameDeptNodes.length > 0) {
            const avgX = sameDeptNodes.reduce((sum, n) => sum + n.x, 0) / sameDeptNodes.length;
            const avgY = sameDeptNodes.reduce((sum, n) => sum + n.y, 0) / sameDeptNodes.length;
            vx += (avgX - x) * CLUSTER_STRENGTH;
            vy += (avgY - y) * CLUSTER_STRENGTH;
          }

          vx *= DAMPING;
          vy *= DAMPING;
          
          // Apply velocity
          x += vx;
          y += vy;

          // B. "Bubble Float" Effect
          // Add a gentle sine wave perturbation based on time and node phase
          // This happens AFTER physics, creating a layer of organic movement on top of the layout
          const floatX = Math.cos(globalTime * node.floatSpeed + node.phase) * 0.2;
          const floatY = Math.sin(globalTime * node.floatSpeed + node.phase) * 0.2;

          x += floatX;
          y += floatY;

          // Bounds
          const margin = 80;
          if (x < margin) { x = margin; vx *= -0.8; }
          if (x > dimensions.width - margin) { x = dimensions.width - margin; vx *= -0.8; }
          if (y < margin) { y = margin; vy *= -0.8; }
          if (y > dimensions.height - margin) { y = dimensions.height - margin; vy *= -0.8; }

          return { ...node, x, y, vx, vy };
        });
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black selection:bg-cyan-500 selection:text-black">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.5)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] pointer-events-none"></div>

      {/* Connections Layer (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => {
            const sameDept = nodes.filter((n, j) => (n.department === node.department || (n.isAgent && node.isAgent)) && j > i);
            return sameDept.map((target, k) => (
                <line 
                    key={`${node.id}-${target.id}`}
                    x1={node.x} y1={node.y}
                    x2={target.x} y2={target.y}
                    stroke={node.isAgent ? '#6366f1' : (deptColors[node.department] || '#555')}
                    strokeWidth="1"
                    strokeOpacity="0.15"
                />
            ));
        })}
      </svg>

      {/* Nodes Layer */}
      {nodes.map(node => {
        const color = node.isAgent ? '#6366f1' : (deptColors[node.department] || '#fff');
        const isNearBottom = node.y > dimensions.height - 180;
        
        // Translation lookups
        const displayDept = language === 'zh' ? (DEPT_TRANSLATIONS[node.department] || node.department) : node.department;
        const displayRole = language === 'zh' ? (ROLE_TRANSLATIONS[node.role] || node.role) : node.role;

        return (
          <div
            key={node.id}
            onClick={() => onSelectProfile(node.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 hover:z-[100]"
            style={{ left: node.x, top: node.y }}
          >
            {/* Hover Aura */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            ></div>
            
            {/* Tech Ring */}
            <div 
                className={`w-16 h-16 rounded-full border border-dashed group-hover:animate-spin-slow transition-colors flex items-center justify-center bg-black/50 backdrop-blur-sm ${node.isAgent ? 'border-indigo-500/50 group-hover:border-indigo-400' : 'border-slate-700/50 group-hover:border-white/50'}`}
                style={{ borderColor: node.isAgent ? undefined : `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, 0.3)` }}
            >
                {/* Avatar Core */}
                <div 
                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-black overflow-hidden relative border border-black/50 ${node.isAgent ? 'bg-indigo-600' : ''}`}
                    style={{ backgroundColor: node.isAgent ? undefined : color }}
                >
                    {node.isAgent ? (
                        <Bot className="w-7 h-7 text-white" />
                    ) : node.avatarUrl ? (
                         <img src={node.avatarUrl} alt={node.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                    ) : (
                        node.name.charAt(0)
                    )}
                </div>
            </div>

            {/* Smart Tooltip */}
            <div 
                className={`
                    absolute left-1/2 -translate-x-1/2 w-max 
                    transition-all duration-300 transform 
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    ${isNearBottom ? 'bottom-full mb-4 translate-y-2 group-hover:translate-y-0' : 'top-full mt-4 -translate-y-2 group-hover:translate-y-0'}
                `}
            >
                <div className="bg-slate-900/95 text-white backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col items-center min-w-[140px]">
                    
                    {/* Header */}
                    <div className="text-center w-full border-b border-slate-800 pb-2 mb-2">
                        <div className="flex items-center justify-center gap-1">
                            {node.isAgent && <Bot className="w-3 h-3 text-indigo-400" />}
                            <span className="text-sm font-bold tracking-wide block">{node.name}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest opacity-80" style={{ color: color }}>
                            {displayRole}
                        </span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-between w-full px-2 gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] text-slate-500 uppercase font-mono">{language === 'en' ? 'Dept' : '部门'}</span>
                            <span className="text-[10px] text-slate-300 font-bold">
                                {displayDept}
                            </span>
                        </div>
                        <div className="w-px h-6 bg-slate-800"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] text-slate-500 uppercase font-mono">{language === 'en' ? 'OVR' : '综合'}</span>
                            <span className="text-[14px] font-bold tech-font" style={{ color: color }}>
                                {Math.round((Object.values(node.metrics) as number[]).reduce((a, b) => a + b, 0) / 6)}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Connecting Line */}
                <div className={`
                    absolute left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-slate-700 to-transparent
                    ${isNearBottom ? 'top-full' : 'bottom-full'}
                `}></div>
            </div>
          </div>
        );
      })}

    </div>
  );
};

export default GalaxyView;
