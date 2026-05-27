import React from 'react';
import { getCurrentStage, getNextStage, getProgressToNextStage } from '../data/achievementStages';

const AchievementBadge = ({ fastingRecords, avgDurationHHMM, avgHours }) => {
  const fastCount = fastingRecords.length;

  const currentStage = getCurrentStage(fastCount);
  const nextStage = getNextStage(fastCount);
  const progress = getProgressToNextStage(fastCount);

  const remaining = nextStage ? Math.max(0, nextStage.minFasts - fastCount) : 0;

  const avgText =
    avgDurationHHMM ??
    (avgHours !== undefined && avgHours !== null ? `${avgHours} ש׳` : null);

  return (
    <div
      dir="rtl"
      className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl px-5 py-4"
    >
      {/* Header: simple, one line */}
      <div className="text-xl sm:text-2xl font-extrabold text-purple-950 leading-snug">

השלמת <span className="text-purple-700">{fastCount}</span> צומות
{avgText ? (
  <>
    {' '}
    באורך ממוצע של <span className="text-purple-700">{avgText}</span> שעות
  </>
) : null}

      </div>

      {/* Rank: one big, colorful line (only once) */}
      <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-purple-900">
        הדרגה שלך: <span className="text-purple-700">{currentStage.icon} {currentStage.name}</span>
      </div>

      {/* Progress */}
      {nextStage && (
        <>
          <div className="mt-4">
            <div className="w-full bg-purple-200 rounded-full h-4">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* CTA: short + clear */}
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-purple-950">
            עוד <span className="text-purple-700">{remaining}</span> לדרגה הבאה:{" "}
            <span className="text-purple-700">{nextStage.icon} {nextStage.name}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default AchievementBadge;
