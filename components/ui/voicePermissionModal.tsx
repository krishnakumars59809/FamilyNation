import { Mic, MicOff, X } from 'lucide-react';

interface Props {
  onSelect: (value: boolean) => void;
}

export default function VoicePermissionModal({ onSelect }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      {/* Modal Container */}
      <div className="bg-white w-[92%] max-w-md rounded-2xl shadow-xl p-6 animate-fadeIn relative">
        {/* Close Button (Optional) */}
        <button
          onClick={() => onSelect(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Enable Voice Assistant?
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Choose whether you want to hear spoken responses.
          </p>
        </div>

        {/* Icon */}
        <div className="flex justify-center my-5">
          <div className="h-16 w-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full shadow-inner">
            <Mic size={32} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSelect(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold"
          >
            <div className="flex items-center justify-center gap-2">
              <Mic size={18} />
              Yes, Enable
            </div>
          </button>

          <button
            onClick={() => onSelect(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-xl font-semibold"
          >
            <div className="flex items-center justify-center gap-2">
              <MicOff size={18} />
              No, Continue
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
