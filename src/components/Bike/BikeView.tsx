// src/components/Bike/BikeView.tsx
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Bike as BikeIcon, Pencil, Check, X } from "lucide-react";
import { BikeIdea, BikeEvent } from "../../types";
import { storage } from "../../utils/storage";
import IdeaModal from "../Ideas/IdeaModal";
import EventModal from "../Ideas/EventModal";

const BikeView: React.FC = () => {
  const [ideas, setIdeas] = useState<BikeIdea[]>([]);
  const [events, setEvents] = useState<BikeEvent[]>([]);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // initial load
  useEffect(() => {
    (async () => {
      const [i, e] = await Promise.all([
        storage.getBikeIdeas(),
        storage.getBikeEvents(),
      ]);
      setIdeas(i);
      setEvents(e);
    })().catch(console.error);
  }, []);

  // create handlers
  const handleAddIdea = async (content: string) => {
    const created = await storage.addBikeIdea(content);
    setIdeas((prev) => [created, ...prev]);
    setShowIdeaModal(false);
  };

  const handleAddEvent = async (
    evt: Omit<BikeEvent, "id" | "createdAt" | "updatedAt">
  ) => {
    const created = await storage.addBikeEvent(evt);
    setEvents((prev) => [...prev, created]);
    setShowEventModal(false);
  };

  // delete handlers
  const deleteIdea = async (id: string) => {
    await storage.deleteBikeIdea(id);
    setIdeas((prev) => prev.filter((x) => x.id !== id));
  };

  const beginEdit = (id: string) => {
    const i = ideas.find(x => x.id === id);
    if (!i) return;
    setEditingId(id);
    setEditingContent(i.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updated = await storage.updateBikeIdea(editingId, { content: editingContent.trim() });
    setIdeas(prev => prev.map(i => i.id === editingId ? updated : i));
    cancelEdit();
  };

  const deleteEvent = async (id: string) => {
    await storage.deleteBikeEvent(id);
    setEvents((prev) => prev.filter((x) => x.id !== id));
  };

  // sort: ideas newest first, events upcoming first
  const sortedIdeas = [...ideas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const upcomingEvents = [...events]
    .filter((e) => new Date(e.date) >= new Date())
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BikeIcon className="h-6 w-6 text-gray-800" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Bike</h1>
              <p className="text-sm text-gray-500">
                Idea board and upcoming bike events
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bike Ideas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Ideas</h2>
                <p className="text-sm text-gray-500">
                  Setup tweaks, parts lists, ride plans, training notes
                </p>
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
              {sortedIdeas.length === 0 ? (
                <div className="text-center py-8">
                  <BikeIcon className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No bike ideas yet</p>
                </div>
              ) : (
                sortedIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="group p-4 border border-gray-200 rounded-md hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      {editingId === idea.id ? (
                        <div className="flex items-center w-full gap-2">
                          <input
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            autoFocus
                          />
                          <button className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700" onClick={saveEdit}>
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700 flex-1">{idea.content}</p>
                      )}
                      <button
                        onClick={() => beginEdit(idea.id)}
                        className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      >
                        <Pencil className="h-3 w-3 text-gray-500" />
                      </button>
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

          {/* Bike Events */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Events</h2>
                <p className="text-sm text-gray-500">
                  Races, trips, service, maintenance
                </p>
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
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          {event.type && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                              {event.type}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
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
        <IdeaModal onClose={() => setShowIdeaModal(false)} onSave={handleAddIdea} />
      )}
      {showEventModal && (
        <EventModal onClose={() => setShowEventModal(false)} onSave={handleAddEvent} />
      )}
    </div>
  );
};

export default BikeView;
