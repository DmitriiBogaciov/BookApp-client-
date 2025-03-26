
interface DeleteBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

export default function DeleteBlockModal({ isOpen, onClose, onConfirm, message }: DeleteBlockModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white min-w-[200px] max-w-[400px] lg p-4 rounded shadow-md
            md:min-w-[400px]">
                <p>{message}</p>
                <div className="flex justify-end mt-4">
                    <button className="mr-2 p-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                    <button className="p-2 bg-red-500 text-white rounded" onClick={onConfirm}>Confirm</button> 
                </div>
            </div>
        </div>
    );
}