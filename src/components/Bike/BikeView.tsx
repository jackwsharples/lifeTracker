import React, { useState, useEffect } from 'react';
import { Plus, Lightbulb, Calendar, Trash2, Bike } from 'lucide-react';
import { BikeIdea, BikeEvent } from '../../types';
import { storage } from '../../utils/storage';
import BikeIdeaModal from './BikeIdeaModal';
import BikeEventModal from './BikeEventModal';

const BikeView: React.FC = () => {
  const [bikeIdeas, setBikeIdeas] = useState<BikeIdea[]>([]);
  const [bikeEvents, setBikeEvents] = useState<BikeEvent[]>([]);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    setBikeIdeas(storage.getBikeIdeas());
    setBikeEvents(storage.getBikeEvents());
  }, []);

  const saveBikeIdeas = (newIdeas: BikeIdea[]) => {
    setBikeIdeas(newIdeas);
    storage.saveBikeIdeas(newIdeas);
  };

  const saveBikeEvents = (newEvents: BikeEvent[]) => {
    setBikeEvents(newEvents);
    storage.saveBikeEvents(newEvents);
  };

  const handleAddIdea = (content: string) => {
    const newIdea: BikeIdea = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveBikeIdeas([...bikeIdeas, newIdea]);
    setShowIdeaModal(false);
  };

  const handleAddEvent = (event: Omit<BikeEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: BikeEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveBikeEvents([...bikeEvents, newEvent]);
    setShowEventModal(false);
  };

  const deleteIdea = (ideaId: string) => {
    const updatedIdeas = bikeIdeas.filter(idea => idea.id !== ideaId);
    saveBikeIdeas(updatedIdeas);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = bikeEvents.filter(event => event.id !== eventId);
    saveBikeEvents(updatedEvents);
  };

  const upcomingEvents = bikeEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bike Ideas Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bike Ideas</h2>
                <p className="text-sm text-gray-500">Parts, maintenance, goals</p>
              </div>
              <button
                onClick={() => setShowIdeaModal(true)}
                className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {bikeIdeas.length === 0 ? (
                <div className="text-center py-8">
                  <Bike className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No bike ideas yet</p>
                </div>
              ) : (
                bikeIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="group p-4 border border-gray-200 rounded-md hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-700 flex-1">{idea.content}</p>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bike Events Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bike Events</h2>
                <p className="text-sm text-gray-500">Races, trips, service</p>
              </div>
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group p-4 border border-gray-200 rounded-md hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {event.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600">{event.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showIdeaModal && (
        <BikeIdeaModal
          onClose={() => setShowIdeaModal(false)}
          onSave={handleAddIdea}
        />
      )}

      {showEventModal && (
        <BikeEventModal
          onClose={() => setShowEventModal(false)}
          onSave={handleAddEvent}
        />
      )}
    </div>
  );
};

export default BikeView;