import React from 'react';
import { ContextAction } from '../services/enhancedService.ts';

interface ContextActionsProps {
  actions: ContextAction[];
  onAction: (action: ContextAction) => void;
}

export const ContextActions: React.FC<ContextActionsProps> = ({ actions, onAction }) => {
  if (!actions || actions.length === 0) return null;

  const getActionStyles = (type: string) => {
    switch (type) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
      case 'download':
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';
      case 'navigate':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
      case 'external_link':
        return 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
    }
  };

  return (
    <div className="mt-3 space-y-2 animate-in slide-in-from-bottom duration-300">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Actions</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onAction(action)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all transform hover:scale-105 shadow-sm ${getActionStyles(
              action.type
            )}`}
          >
            {action.icon && <span>{action.icon}</span>}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Follow-up Questions Component
interface FollowUpQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({ questions, onSelect }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-3 space-y-2 animate-in slide-in-from-bottom duration-300 delay-150">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">You might also want to know</p>
      <div className="space-y-1.5">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="w-full text-left px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-100 transition-all"
          >
            💡 {question}
          </button>
        ))}
      </div>
    </div>
  );
};
