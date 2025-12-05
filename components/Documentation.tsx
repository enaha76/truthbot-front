
import React from 'react';
import { BookOpen, GraduationCap, Brain, Bot, Scan, Lock, CheckCircle, Wrench, Code, Sparkles, Palette } from 'lucide-react';

export const Documentation: React.FC = () => {
   return (
      <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
         {/* Header */}
         <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-surfaceHighlight border border-white/5 mb-4">
               <BookOpen size={48} className="text-primary-DEFAULT" />
            </div>
            <h2 className="text-4xl font-bold text-text-main">Project Documentation</h2>
            <p className="text-text-muted max-w-2xl mx-auto text-lg">
               Understanding the mission, the tech, and the impact of the NIRD initiative.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pedagogical Objectives */}
            <div className="bg-surface p-8 rounded-2xl border border-white/5 hover:border-primary-DEFAULT/30 transition-colors">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                     <GraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text-main">Mission Objectives</h3>
               </div>
               <ul className="space-y-4 text-text-muted">
                  <li className="flex gap-3">
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 shrink-0"></span>
                     <span>Raise awareness about <strong>planned obsolescence</strong> and e-waste.</span>
                  </li>
                  <li className="flex gap-3">
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 shrink-0"></span>
                     <span>Promote <strong>Open Source</strong> alternatives (Linux, Firefox) for digital sovereignty.</span>
                  </li>
                  <li className="flex gap-3">
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 shrink-0"></span>
                     <span>Empower users to repair and repurpose old hardware.</span>
                  </li>
               </ul>
            </div>

            {/* AI Technology */}
            <div className="bg-surface p-8 rounded-2xl border border-white/5 hover:border-primary-DEFAULT/30 transition-colors">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                     <Brain size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-text-main">AI Implementation</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex items-start gap-4">
                     <div className="bg-surfaceHighlight p-2 rounded-lg shrink-0"><Bot size={20} className="text-text-muted" /></div>
                     <div>
                        <h4 className="text-text-main font-medium">NIRD-Bot (Chat)</h4>
                        <p className="text-text-muted text-sm mt-1">Context-aware and personalized assistance for your digital journey.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="bg-surfaceHighlight p-2 rounded-lg shrink-0"><Scan size={20} className="text-text-muted" /></div>
                     <div>
                        <h4 className="text-text-main font-medium">Hardware Scanner (Vision)</h4>
                        <p className="text-text-muted text-sm mt-1">Analyzes device images to suggest repair and reuse strategies.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Privacy & Security */}
         <div className="bg-surface p-8 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                  <Lock size={24} />
               </div>
               <h3 className="text-xl font-bold text-text-main">Privacy & Data</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5">
                  <CheckCircle size={20} className="text-green-400 mb-2" />
                  <h4 className="font-medium text-text-main">Local First</h4>
                  <p className="text-xs text-text-muted mt-1">Data processing prioritized on client/server.</p>
               </div>
               <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5">
                  <CheckCircle size={20} className="text-green-400 mb-2" />
                  <h4 className="font-medium text-text-main">Secure Auth</h4>
                  <p className="text-xs text-text-muted mt-1">Argon2 hashing & JWT tokens.</p>
               </div>
               <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5">
                  <CheckCircle size={20} className="text-green-400 mb-2" />
                  <h4 className="font-medium text-text-main">No Tracking</h4>
                  <p className="text-xs text-text-muted mt-1">We don't sell or share your data.</p>
               </div>
            </div>
         </div>

      </div>
   );
};