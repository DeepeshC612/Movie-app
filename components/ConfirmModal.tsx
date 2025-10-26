'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#093545] rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
        <h3 className="text-white text-xl font-semibold mb-4">{title}</h3>
        <p className="text-white/80 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 h-12 font-semibold text-white border border-white/30 rounded-xl transition-all duration-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 font-semibold text-white rounded-xl transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            style={{ 
              backgroundColor: '#ef4444',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
