import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Workout, Exercise } from '../../types';

interface WorkoutModalProps {
  onClose: () => void;
  onSave: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({ onClose, onSave }) => {
  const [type, setType] = useState<'PUSH' | 'PULL' | 'LEGS'>('PUSH');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Omit<Exercise, 'id' | 'workoutId'>[]>([
    { name: '', sets: 1, reps: 1, weight: 0 }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 1, reps: 1, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Omit<Exercise, 'id' | 'workoutId'>, value: string | number) => {
    const updated = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) return;

    const exercisesWithIds: Exercise[] = validExercises.map((exercise, index) => ({
      ...exercise,
      id: `${Date.now()}-${index}`,
      workoutId: '', // Will be set when workout is created
    }));

    onSave({
      type,
      date,
      notes: notes.trim() || undefined,
      exercises: exercisesWithIds,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Add Workout</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'PUSH' | 'PULL' | 'LEGS')}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="PUSH">Push</option>
                <option value="PULL">Pull</option>
                <option value="LEGS">Legs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Exercises
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Exercise
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Lift (e.g., Bench)"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      className="col-span-4 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sets</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Reps</label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Weight</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="p-1 hover:bg-red-100 rounded text-red-400 hover:text-red-600 transition-colors"
                        disabled={exercises.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Overall workout notes"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutModal;