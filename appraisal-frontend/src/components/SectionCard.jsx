import { FaPencilAlt } from "react-icons/fa";

const SectionCard = ({ title, content }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2 bg-blue-50 border-b px-4 py-2 font-semibold text-gray-700">
        <FaPencilAlt className="text-blue-500" />
        {title} <span className="text-red-500">*</span>
      </div>

      {/* Content */}
      <div className="p-4 text-sm text-gray-700 leading-6 whitespace-pre-line">
        {content}
      </div>
    </div>
  );
};

export default SectionCard;