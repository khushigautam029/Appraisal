
import { BookOpen, Star } from "lucide-react";

const GuidelinePage = () => {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="
        bg-white/80
        backdrop-blur-md
        border border-white/40
        rounded-3xl
        shadow-lg
        p-5
        flex items-center gap-3
      ">
        <div className="
          w-11 h-11
          rounded-2xl
          bg-gradient-to-br from-blue-500 to-indigo-500
          flex items-center justify-center
          shadow-md
        ">
          <BookOpen size={20} className="text-white" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Self Appraisal Guide
          </h1>
          <p className="text-sm text-gray-500">
            Tips to write professional appraisal content
          </p>
        </div>
      </div>

      {/* DO & DON'T */}
      <div className="
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        shadow-lg
        border border-white/40
        overflow-hidden
      ">
        <div className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white
          px-5 py-3
          font-semibold text-sm
        ">
          DOs & DON'Ts
        </div>

        <div className="grid md:grid-cols-2 gap-5 p-5 text-sm">

          {/* DO */}
          <div className="
            bg-green-50/80
            border border-green-100
            rounded-2xl
            p-4
            shadow-sm
          ">
            <h3 className="font-semibold text-green-600 mb-3 text-sm">
              ✅ DOs
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>• Use clear and specific examples</li>
              <li>• Mention measurable results</li>
              <li>• Be honest and realistic</li>
              <li>• Keep it professional</li>
            </ul>
          </div>

          {/* DON'T */}
          <div className="
            bg-red-50/80
            border border-red-100
            rounded-2xl
            p-4
            shadow-sm
          ">
            <h3 className="font-semibold text-red-500 mb-3 text-sm">
              ❌ DON'Ts
            </h3>

            <ul className="space-y-2 text-gray-600">
              <li>• Avoid vague statements</li>
              <li>• Don’t copy generic content</li>
              <li>• Don’t exaggerate</li>
              <li>• Don’t leave sections empty</li>
            </ul>
          </div>

        </div>
      </div>

      {/* COMMON MISTAKES */}
      <div className="
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        shadow-lg
        border border-white/40
        overflow-hidden
      ">
        <div className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white
          px-5 py-3
          font-semibold text-sm
        ">
          Common Mistakes
        </div>

        <div className="p-5 text-sm text-gray-600 space-y-3">
          <p>• Writing too generic content</p>
          <p>• Not providing real examples</p>
          <p>• Ignoring improvement section</p>
          <p>• Giving ratings without justification</p>
        </div>
      </div>

      {/* GOOD VS BAD */}
      <div className="
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        shadow-lg
        border border-white/40
        overflow-hidden
      ">
        <div className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white
          px-5 py-3
          font-semibold text-sm
        ">
          Good vs Bad Example
        </div>

        <div className="grid md:grid-cols-2 gap-5 p-5 text-sm">

          <div className="
            bg-red-50
            border border-red-100
            rounded-2xl
            p-4
          ">
            <h3 className="font-semibold text-red-500 mb-2">
              Bad ❌
            </h3>

            <p className="text-gray-600">
              "I worked well on project"
            </p>
          </div>

          <div className="
            bg-green-50
            border border-green-100
            rounded-2xl
            p-4
          ">
            <h3 className="font-semibold text-green-600 mb-2">
              Good ✅
            </h3>

            <p className="text-gray-600">
              "Completed Project A before deadline and improved
              system performance by 20%"
            </p>
          </div>

        </div>
      </div>

      {/* WRITING TIPS */}
      <div className="
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        shadow-lg
        border border-white/40
        overflow-hidden
      ">
        <div className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white
          px-5 py-3
          font-semibold text-sm
        ">
          Writing Tips
        </div>

        <div className="p-5 text-sm text-gray-600 space-y-3">
          <p>• Write 3–5 clear bullet points</p>
          <p>• Keep sentences short and meaningful</p>
          <p>• Focus on impact and achievements</p>
          <p>• Use action words like Improved, Led, Delivered</p>
        </div>
      </div>

      {/* MANAGER EXPECTATIONS */}
      <div className="
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        shadow-lg
        border border-white/40
        overflow-hidden
      ">
        <div className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white
          px-5 py-3
          font-semibold text-sm
        ">
          What Managers Look For
        </div>

        <div className="p-5 text-sm text-gray-600 space-y-3">
          <p>• Quality of work</p>
          <p>• Timely delivery</p>
          <p>• Team collaboration</p>
          <p>• Initiative and ownership</p>
          <p>• Learning and growth</p>
        </div>
      </div>

      {/* RATING GUIDE */}
      <div className="
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        shadow-lg
        border border-white/40
        overflow-hidden
      ">
        <div className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white
          px-5 py-3
          font-semibold text-sm
        ">
          Rating Guide
        </div>

        <div className="p-5 space-y-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className="
                flex items-center justify-between
                bg-gray-50
                border border-gray-100
                rounded-2xl
                px-4 py-3
                shadow-sm
              "
            >
              <div className="flex gap-1">
                {[...Array(s)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <span className="text-sm text-gray-600 font-medium">
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

      {/* STEPS */}
      <div className="
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        shadow-lg
        border border-white/40
        overflow-hidden
      ">
        <div className="
          bg-gradient-to-r from-blue-500 to-indigo-500
          text-white
          px-5 py-3
          font-semibold text-sm
        ">
          Steps to Fill Appraisal
        </div>

        <div className="p-5 text-sm text-gray-600 space-y-3">
          <p>1. Review your tasks and performance</p>
          <p>2. Write achievements clearly</p>
          <p>3. Mention improvement areas</p>
          <p>4. Add skills and contributions</p>
          <p>5. Save or submit appraisal</p>
        </div>
      </div>

      {/* CTA */}
      <div className="
        bg-gradient-to-r from-blue-600 to-indigo-600
        text-white
        rounded-3xl
        shadow-xl
        p-5
        text-center
      ">
        <p className="text-sm font-medium">
          Use this guide to write a strong and professional
          self appraisal 🚀
        </p>
      </div>

    </div>
  );
};

export default GuidelinePage;

