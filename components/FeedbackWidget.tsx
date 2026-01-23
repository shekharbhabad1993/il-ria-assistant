import React, { useState, useEffect } from 'react';

interface FeedbackWidgetProps {
  messageId: string;
  sessionId: string;
  onSubmit: (rating: number, comment?: string) => void;
  autoShow?: boolean;
  delayMs?: number;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  messageId,
  sessionId,
  onSubmit,
  autoShow = true,
  delayMs = 60000 // 1 minute default
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, delayMs);

      return () => clearTimeout(timer);
    }
  }, [autoShow, delayMs]);

  const handleSubmit = () => {
    if (rating) {
      onSubmit(rating, comment || undefined);
      setSubmitted(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 2500);
    }
  };

  if (!showFeedback) return null;

  if (submitted) {
    return (
      <div className="mt-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl animate-in fade-in zoom-in-95 duration-300 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-green-800 uppercase tracking-wide">Thank you!</p>
            <p className="text-xs font-medium text-green-600 mt-0.5">Your feedback helps us improve</p>
          </div>
        </div>
      </div>
    );
  }

  const getRatingLabel = (stars: number) => {
    const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return labels[stars - 1];
  };

  const displayRating = hoverRating || rating || 0;

  return (
    <div className="mt-4 p-5 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-2 border-slate-200 rounded-2xl animate-in slide-in-from-bottom duration-300 shadow-lg hover:shadow-xl transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-slate-800 uppercase tracking-wide">Was this helpful?</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Your feedback matters to us</p>
          </div>
          <button
            onClick={() => setShowFeedback(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Star Rating with Labels */}
        <div className="space-y-2">
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className={`text-3xl transition-all transform hover:scale-125 active:scale-110 focus:outline-none ${
                  (hoverRating || rating || 0) >= star
                    ? 'text-yellow-400 drop-shadow-[0_2px_4px_rgba(250,204,21,0.5)]'
                    : 'text-slate-300 hover:text-yellow-200'
                }`}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Rating Label */}
          {displayRating > 0 && (
            <p className="text-center text-sm font-bold text-slate-600 animate-in fade-in duration-200">
              {getRatingLabel(displayRating)}
            </p>
          )}
        </div>

        {/* Comment Box (appears after rating) */}
        {rating && (
          <div className="animate-in slide-in-from-top duration-200 space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts to help us improve..."
              className="w-full border-2 border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none transition-all bg-white shadow-inner"
              rows={3}
              maxLength={500}
            />
            <p className="text-[10px] text-slate-400 text-right font-medium">
              {comment.length}/500 characters
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {rating && (
          <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowFeedback(false)}
              className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all uppercase tracking-wider"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-black rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all uppercase tracking-wider shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Improved Idle Detection Component
interface IdlePromptProps {
  onResponse: () => void;
  idleTimeMs?: number;
}

export const IdlePrompt: React.FC<IdlePromptProps> = ({
  onResponse,
  idleTimeMs = 120000 // 2 minutes default
}) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, idleTimeMs);

    return () => clearTimeout(timer);
  }, [idleTimeMs]);

  const handleResponse = () => {
    setShowPrompt(false);
    onResponse();
  };

  if (!showPrompt) return null;

  return (
    <div className="flex justify-center py-4 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-4 rounded-2xl border-2 border-slate-200 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-slate-700 uppercase tracking-wide">Still there?</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Need any more help?</p>
          </div>
          <button
            onClick={handleResponse}
            className="ml-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-black rounded-full hover:from-orange-600 hover:to-orange-700 transition-all uppercase tracking-wider shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Yes, I'm here
          </button>
        </div>
      </div>
    </div>
  );
};
