import { BookOpen, Star } from "lucide-react";

const GuidelinePage = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen size={20} className="text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-800">
          Self Appraisal Guide
        </h1>
      </div>

      {/* DOs & DON'Ts */}
      <div className="bg-white rounded shadow">
        <div className="bg-blue-50 p-3 font-semibold">
          DOs & DON'Ts
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 text-sm text-gray-600">

          <div>
            <h3 className="font-semibold text-green-600 mb-2">DOs</h3>
            <ul className="space-y-1">
              <li>• Use clear and specific examples</li>
              <li>• Mention measurable results (% improvement)</li>
              <li>• Be honest and realistic</li>
              <li>• Keep it professional and concise</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-500 mb-2">DON’Ts</h3>
            <ul className="space-y-1">
              <li>• Avoid vague statements</li>
              <li>• Don’t copy generic content</li>
              <li>• Don’t exaggerate achievements</li>
              <li>• Don’t leave sections empty</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Common Mistakes */}
      <div className="bg-white rounded shadow">
        <div className="bg-blue-50 p-3 font-semibold">
          Common Mistakes
        </div>

        <div className="p-4 text-sm text-gray-600 space-y-2">
          <p>• Writing too generic content</p>
          <p>• Not providing real examples</p>
          <p>• Ignoring improvement section</p>
          <p>• Giving high rating without justification</p>
        </div>
      </div>

      {/* Good vs Bad Example */}
      <div className="bg-white rounded shadow">
        <div className="bg-blue-50 p-3 font-semibold">
          Good vs Bad Example
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 text-sm">

          <div className="bg-red-50 border rounded p-3">
            <h3 className="font-semibold text-red-500 mb-1">Bad ❌</h3>
            <p className="text-gray-600">
              "I worked well on project"
            </p>
          </div>

          <div className="bg-green-50 border rounded p-3">
            <h3 className="font-semibold text-green-600 mb-1">Good ✅</h3>
            <p className="text-gray-600">
              "Completed Project A before deadline and improved system performance by 20%"
            </p>
          </div>

        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-white rounded shadow">
        <div className="bg-blue-50 p-3 font-semibold">
          Writing Tips
        </div>

        <div className="p-4 text-sm text-gray-600 space-y-2">
          <p>• Write 3–5 clear bullet points per section</p>
          <p>• Keep sentences short and meaningful</p>
          <p>• Focus on impact, not just tasks</p>
          <p>• Use action words like "Improved", "Delivered", "Led"</p>
        </div>
      </div>

      {/* What Managers Look For */}
      <div className="bg-white rounded shadow">
        <div className="bg-blue-50 p-3 font-semibold">
          What Managers Look For
        </div>

        <div className="p-4 text-sm text-gray-600 space-y-2">
          <p>• Quality of work</p>
          <p>• Timely delivery</p>
          <p>• Team collaboration</p>
          <p>• Initiative and ownership</p>
          <p>• Learning and growth</p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded shadow">
        <div className="bg-blue-50 p-3 font-semibold">
          Rating Guide
        </div>

        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center justify-between border p-2 rounded">
              
              <div className="flex gap-1">
                {[...Array(s)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400" />
                ))}
              </div>

              <span className="text-sm text-gray-600">
                {s === 5 && "Outstanding"}
                {s === 4 && "Exceeds Expectations"}
                {s === 3 && "Meets Expectations"}
                {s === 2 && "Needs Improvement"}
                {s === 1 && "Below Expectations"}
              </span>

            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white rounded shadow">
        <div className="bg-blue-50 p-3 font-semibold">
          Steps to Fill Appraisal
        </div>

        <div className="p-4 space-y-2 text-sm text-gray-600">
          <p>1. Review your tasks and performance</p>
          <p>2. Write achievements clearly</p>
          <p>3. Mention improvement areas</p>
          <p>4. Add skills and contributions</p>
          <p>5. Save or submit appraisal</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black text-white p-4 rounded text-center text-sm">
        Use this guide to write a strong and professional self appraisal 🚀
      </div>

    </div>
  );
};

export default GuidelinePage;