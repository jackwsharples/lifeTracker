import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight, Dumbbell } from 'lucide-react';
import { Workout } from '../../types';
import { storage } from '../../utils/storage';
import WorkoutModal from './WorkoutModal';

const WorkoutsView: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'PUSH' | 'PULL' | 'LEGS'>('PUSH');
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());

  useEffect(() => {
    setWorkouts(storage.getWorkouts());
  }, []);

  const saveWorkouts = (newWorkouts: Workout[]) => {
    setWorkouts(newWorkouts);
    storage.saveWorkouts(newWorkouts);
  };

  const handleAddWorkout = (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveWorkouts([...workouts, newWorkout]);
    setShowWorkoutModal(false);
  };

  const toggleWorkoutExpansion = (workoutId: string) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedWorkouts(newExpanded);
  };

  const getWorkoutsForType = (type: 'PUSH' | 'PULL' | 'LEGS') => {
    return workouts
      .filter(workout => workout.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const tabs = [
    { id: 'PUSH' as const, label: 'Push' },
    { id: 'PULL' as const, label: 'Pull' },
    { id: 'LEGS' as const, label: 'Legs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Workouts</h1>
            <p className="text-sm text-gray-500">Push / Pull / Legs</p>
          </div>
          <button
            onClick={() => setShowWorkoutModal(true)}
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Workout
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-black text-black bg-gray-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {getWorkoutsForType(activeTab).length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No {activeTab.toLowerCase()} workouts yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getWorkoutsForType(activeTab).map((workout) => {
                  const isExpanded = expandedWorkouts.has(workout.id);
                  
                  return (
                    <div key={workout.id} className="border border-gray-200 rounded-md">
                      <button
                        onClick={() => toggleWorkoutExpansion(workout.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {workout.type} - {new Date(workout.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {workout.exercises.length} exercises
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="space-y-3">
                            {workout.exercises.map((exercise) => (
                              <div key={exercise.id} className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">{exercise.name}</span>
                                <span className="text-sm text-gray-600">
                                  {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}lbs
                                </span>
                              </div>
                            ))}
                          </div>
                          {workout.notes && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {workout.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showWorkoutModal && (
        <WorkoutModal
          onClose={() => setShowWorkoutModal(false)}
          onSave={handleAddWorkout}
        />
      )}
    </div>
  );
};

export default WorkoutsView;