import EmployeeInfoCard from "../components/EmployeeInfoCard";
import SectionCard from "../components/SectionCard";

const EmployeeAppraisal = () => {
  return (
    <div className="space-y-6">

      {/* Employee Info */}
      <EmployeeInfoCard />

      {/* Sections */}
      <div className="grid grid-cols-2 gap-6">

        {/* 🔹 ACHIEVEMENTS */}
        <SectionCard
          title="Achievements (What you did well)"
          content={`• Completed assigned projects on time with quality output
• Contributed to team success and collaboration
• Improved performance or efficiency (mention % if possible)
• Learned and applied new technologies or tools

Example:
- Completed Project A before deadline and improved load time by 20%
- Helped teammates resolve issues and ensured smooth delivery`}
        />

        {/* 🔹 IMPROVEMENTS */}
        <SectionCard
          title="Improvements (Areas to work on)"
          content={`• Time management and task prioritization
• Better documentation and reporting
• Improving coding standards or quality
• Learning new skills or tools

Example:
- Need to improve time estimation for tasks
- Should focus more on writing clean and maintainable code`}
        />

        {/* 🔹 SKILLS */}
        <SectionCard
          title="Skills (What you can add)"
          content={`Include both technical and soft skills:

Technical Skills:
• Programming languages (Java, Python, etc.)
• Frameworks (React, Spring Boot)
• Tools (Git, Docker, Firebase)

Soft Skills:
• Communication
• Teamwork
• Problem-solving
• Leadership

Example:
- Strong in React and API integration
- Good communication and teamwork skills`}
        />

        {/* 🔹 ORGANIZATIONAL WORK */}
        <SectionCard
          title="Organizational Work (Extra contributions)"
          content={`• Participation in company activities
• Helping team members or mentoring juniors
• Taking initiative beyond assigned work
• Contributing to team culture or events

Example:
- Helped onboard new team members
- Participated in internal hackathon
- Organized team meetings or knowledge sessions`}
        />

      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 pt-4">

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded shadow-sm">
          Submit
        </button>

        <button className="bg-blue-400 hover:bg-blue-500 text-white px-5 py-2 rounded shadow-sm">
          Save
        </button>

        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded shadow-sm">
          Cancel
        </button>

      </div>

    </div>
  );
};

export default EmployeeAppraisal;