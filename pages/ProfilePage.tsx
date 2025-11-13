import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, ExperienceLevel } from '../types';

const ProfilePage: React.FC = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setSkillsInput(user.skills.join(', '));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSkillsInput(e.target.value);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      setIsSaving(true);
      setSaveError(null);
      try {
        const updatedUser = {
            ...formData,
            skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean)
        };
        await updateUser(updatedUser);
        setIsEditing(false);
      } catch (error) {
        console.error(error);
        setSaveError('Failed to save profile. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (authLoading || !formData) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled className="mt-1 block w-full p-2 border rounded-md shadow-sm bg-gray-200 dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Education / Department</label>
                <input type="text" name="education" value={formData.education} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600">
                    {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Career Track</label>
            <input type="text" name="careerTrack" value={formData.careerTrack} onChange={handleInputChange} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600"/>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills (comma-separated)</label>
            <input name="skills" value={skillsInput} onChange={handleSkillsChange} disabled={!isEditing} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600"/>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Projects or Experience Descriptions</label>
            <textarea name="projects" value={formData.projects} onChange={handleInputChange} disabled={!isEditing} rows={4} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600"/>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Career Interests or Target Roles</label>
            <textarea name="careerInterests" value={formData.careerInterests} onChange={handleInputChange} disabled={!isEditing} rows={2} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600"/>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CV Text / Notes</label>
            <textarea name="cvNotes" value={formData.cvNotes} onChange={handleInputChange} disabled={!isEditing} rows={6} className="mt-1 block w-full p-2 border rounded-md shadow-sm disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:bg-gray-900 dark:border-gray-600"/>
        </div>

        {isEditing && (
            <div className="flex justify-end items-center gap-4 pt-4">
                {saveError && <p className="text-sm text-red-500 mr-auto">{saveError}</p>}
                <button type="button" onClick={() => { setIsEditing(false); setFormData(user); setSkillsInput(user?.skills.join(', ') || '') }} disabled={isSaving} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50">
                    Cancel
                </button>
                <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;