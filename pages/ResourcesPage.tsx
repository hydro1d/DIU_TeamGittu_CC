
import React, { useState, useEffect, useMemo } from 'react';
import { getResources } from '../services/apiService';
import { Resource } from '../types';
import { DollarSign, BookOpen } from '../components/icons';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{resource.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2"><BookOpen className="w-4 h-4"/> {resource.platform}</p>
            </div>
            <span className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${resource.cost === 'Free' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                <DollarSign className="w-3 h-3" /> {resource.cost}
            </span>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-sm">Related Skills:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {resource.relatedSkills.map(skill => (
                    <span key={skill} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                ))}
            </div>
        </div>
    </a>
);


const ResourcesPage: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [skillFilter, setSkillFilter] = useState('');

    useEffect(() => {
        const loadResources = async () => {
            setLoading(true);
            try {
                const fetchedResources = await getResources();
                setResources(fetchedResources);
            } catch (error) {
                console.error("Failed to fetch resources", error);
            } finally {
                setLoading(false);
            }
        };
        loadResources();
    }, []);

    const allSkills = useMemo(() => {
        const skillSet = new Set<string>();
        resources.forEach(res => res.relatedSkills.forEach(skill => skillSet.add(skill)));
        return Array.from(skillSet).sort();
    }, [resources]);

    const filteredResources = useMemo(() => {
        if (!skillFilter) return resources;
        return resources.filter(res => res.relatedSkills.includes(skillFilter));
    }, [resources, skillFilter]);

    if (loading) return <div>Loading resources...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Expand Your Knowledge</h1>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                 <select
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="p-2 border rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value="">Filter by Skill...</option>
                    {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                </select>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredResources.length > 0 ? (
                    filteredResources.map(res => <ResourceCard key={res.id} resource={res} />)
                ) : (
                    <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500">No resources match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default ResourcesPage;
