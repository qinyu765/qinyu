import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar/Stats */}
        <div className="md:col-span-1 space-y-6">
           {/* Avatar Box */}
           <div className="bg-gradient-to-b from-p3blue to-p3dark p-1 border-2 border-white transform -skew-x-6">
              <div className="aspect-[3/4] bg-p3dark relative overflow-hidden">
                 <img src="/images/user_admin.jpg" alt="Avatar" className="w-full h-full object-cover" loading="lazy" />
              </div>
           </div>

           {/* Stats */}
           <div className="bg-p3dark/60 p-4 border border-white/20 font-mono text-sm space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-1">
                 <span className="text-p3mid/60">ROLE</span>
                 <span className="text-p3cyan">DEVELOPER</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                 <span className="text-p3mid/60">LVL</span>
                 <span className="text-white">99</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                 <span className="text-p3mid/60">EXP</span>
                 <span className="text-white">MAX</span>
              </div>
           </div>
        </div>

        {/* Right Column: Info */}
        <div className="md:col-span-2 space-y-8">
           <div className="bg-white/5 p-8 border-l-4 border-p3cyan relative">
              <h1 className="text-5xl font-display font-black italic mb-6">STATUS</h1>
              
              <div className="space-y-6 text-p3white/80 font-light text-lg">
                <p>
                  Welcome to my digital cognitive world. I am a frontend engineer focused on creating immersive web experiences that blur the line between utility and art.
                </p>
                <p>
                  This site is a tribute to the UI aesthetics of Persona 3 Reload, built entirely with React and Tailwind CSS.
                </p>
              </div>

              {/* Skill Matrix */}
              <div className="mt-12">
                 <h2 className="text-xl font-bold uppercase text-p3cyan mb-4 flex items-center">
                    <span className="w-2 h-2 bg-white mr-2" />
                    Technical Skills
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {([
                      ['React / Next.js', '90%'],
                      ['TypeScript', '85%'],
                      ['Tailwind CSS', '80%'],
                      ['Three.js', '60%'],
                      ['Node.js', '75%'],
                      ['UI/UX Design', '70%'],
                    ] as const).map(([skill, width]) => (
                       <div key={skill} className="bg-p3dark/50 p-3 border border-white/10 flex items-center justify-between group hover:bg-p3blue/20 transition-colors cursor-default">
                          <span>{skill}</span>
                          <div className="w-12 h-1 bg-p3blue/30 overflow-hidden">
                             <div className="h-full bg-p3cyan" style={{ width }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};