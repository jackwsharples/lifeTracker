import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Trash2 } from 'lucide-react';
import { Class, WorkItem, ImportantDate } from '../../types';
import { storage } from '../../utils/storage';
import WorkItemModal from './WorkItemModal';
import ImportantDateModal from './ImportantDateModal';
import AddClassModal from './AddClassModal';

const ClassesView: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [showWorkItemModal, setShowWorkItemModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // initial load
  useEffect(() => {
    (async () => {
      const [cls, items, dates] = await Promise.all([
        storage.getClasses(),
        storage.getWorkItems(),
        storage.getImportantDates(),
      ]);
      setClasses(cls);
      setWorkItems(items);
      setImportantDates(dates);
    })().catch(console.error);
  }, []);

  // ------- helpers to refresh only what changed -------
  const refreshWorkItems = async () => setWorkItems(await storage.getWorkItems());
  const refreshDates = async () => setImportantDates(await storage.getImportantDates());
  const refreshClasses = async () => setClasses(await storage.getClasses());

  // ------- create handlers (DB-first, then refresh) -------
  const handleAddWorkItem = async (item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await storage.createWorkItem(item);
      await refreshWorkItems();
      setShowWorkItemModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddImportantDate = async (date: Omit<ImportantDate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await storage.createImportantDate(date);
      await refreshDates();
      setShowDateModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddClass = async (className: string) => {
    try {
      await storage.createClass(className);
      await refreshClasses();
      setShowClassModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  // ------- update/delete handlers -------
  const toggleWorkItem = async (itemId: string) => {
    try {
      const item = workItems.find(w => w.id === itemId);
      if (!item) return;
      await storage.updateWorkItem(itemId, { completed: !item.completed });
      await refreshWorkItems();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteWorkItem = async (itemId: string) => {
    try {
      await storage.deleteWorkItem(itemId);
      await refreshWorkItems();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImportantDate = async (dateId: string) => {
    try {
      await storage.deleteImportantDate(dateId);
      await refreshDates();
    } catch (e) {
      console.error(e);
    }
  };

  // ------- selectors (unchanged) -------
  const getWorkItemsForClass = (classId: string) =>
    workItems.filter(item => item.classId === classId);

  const getImportantDatesForClass = (classId: string) =>
    importantDates.filter(date => date.classId === classId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
          <button
            onClick={() => setShowClassModal(true)}
            className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </button>
        </div>

        <div className="space-y-8">
          {classes.map((classItem) => {
            const classWorkItems = getWorkItemsForClass(classItem.id);
            const classDates = getImportantDatesForClass(classItem.id);
            const pendingItems = classWorkItems.filter(item => !item.completed);
            const completedItems = classWorkItems.filter(item => item.completed);

            return (
              <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{classItem.name}</h2>
                  <span className="text-sm text-gray-500">Class</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Work to do */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Work to do</h3>
                    <div className="space-y-2">
                      {pendingItems.map((item) => (
                        <div
                          key={item.id}
                          className="group p-3 border border-gray-200 rounded-md bg-red-50 hover:shadow-sm transition-all cursor-pointer"
                          onClick={() => toggleWorkItem(item.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{item.title}</span>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWorkItem(item.id);
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteWorkItem(item.id);
                                }}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Trash2 className="h-3 w-3 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClassId(classItem.id);
                        setShowWorkItemModal(true);
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
                    >
                      Add work item
                    </button>
                  </div>

                  {/* Done */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Done</h3>
                    <div className="space-y-2">
                      {completedItems.map((item) => (
                        <div
                          key={item.id}
                          className="group p-3 border border-gray-200 rounded-md bg-red-50 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 line-through">{item.title}</span>
                            <button
                              onClick={() => deleteWorkItem(item.id)}
                              className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important dates */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Important dates</h3>
                    <div className="space-y-2">
                      {classDates.map((date) => (
                        <div
                          key={date.id}
                          className="group p-3 border border-gray-200 rounded-md hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-700">{date.title}</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(date.date).toLocaleDateString()}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteImportantDate(date.id)}
                              className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClassId(classItem.id);
                        setShowDateModal(true);
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
                    >
                      Add important date
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showWorkItemModal && (
        <WorkItemModal
          classId={selectedClassId}
          onClose={() => setShowWorkItemModal(false)}
          onSave={handleAddWorkItem}
        />
      )}

      {showDateModal && (
        <ImportantDateModal
          classId={selectedClassId}
          onClose={() => setShowDateModal(false)}
          onSave={handleAddImportantDate}
        />
      )}

      {showClassModal && (
        <AddClassModal
          onClose={() => setShowClassModal(false)}
          onSave={handleAddClass}
        />
      )}
    </div>
  );
};

export default ClassesView;
