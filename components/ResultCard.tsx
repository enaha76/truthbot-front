import React from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, AlertCircle, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  
  // Don't render anything for user messages
  if (result.verdict === 'user') {
    return null;
  }
  
  const getVerdictStyle = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'true': return { 
        color: '#2C7A7B', // Using Primary Teal for True/Verified
        bg: 'bg-mint dark:bg-primary/10',
        border: 'border-secondary dark:border-primary/20',
        icon: ShieldCheck 
      };
      case 'false': return { 
        color: '#ef4444', // Red 500
        bg: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-200 dark:border-red-500/20',
        icon: AlertCircle 
      };
      case 'misleading': return { 
        color: '#f59e0b', // Amber 500
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-500/20',
        icon: AlertTriangle 
      };
      case 'welcome': return { 
        color: '#2C7A7B',
        bg: 'bg-mint dark:bg-primary/10',
        border: 'border-secondary dark:border-primary/20',
        icon: ShieldCheck 
      };
      default: return { 
        color: '#6b7280', 
        bg: 'bg-gray-50 dark:bg-gray-500/10',
        border: 'border-gray-200 dark:border-gray-500/20',
        icon: HelpCircle 
      };
    }
  };

  const style = getVerdictStyle(result.verdict);
  const VerdictIcon = style.icon;

  const scoreData = [
    { name: 'Score', value: result.score },
    { name: 'Rest', value: 100 - result.score },
  ];

  // Display image if it's an image analysis
  const ImageDisplay = result.type === 'image' && result.originalContent ? (
    <div className="mb-6 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <img 
        src={`data:image/jpeg;base64,${result.originalContent}`}
        alt="Analyzed image"
        className="w-full max-h-96 object-cover"
      />
    </div>
  ) : null;

  return (
    <div className="w-full text-gray-800 dark:text-gray-100 animate-fadeIn">
      {ImageDisplay}
      
      
      {/* Summary Card */}
      <div className={`mb-6 rounded-2xl border ${style.border} ${style.bg} overflow-hidden shadow-sm`}>
        <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
          
          {/* Chart Widget */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={38}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="score" fill={style.color} />
                  <Cell key="rest" fill="currentColor" className="text-gray-200 dark:text-white/10" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold" style={{ color: style.color }}>{result.score}%</span>
            </div>
          </div>

          {/* Verdict Text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <VerdictIcon className="w-5 h-5" style={{ color: style.color }} />
              <h3 className="text-lg font-bold uppercase tracking-wide" style={{ color: style.color }}>
                {result.verdict}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
};