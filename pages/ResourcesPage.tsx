
import React, { useState, useEffect, useMemo } from 'react';
import { getResources } from '../services/apiService';
import { Resource } from '../types';
import { BookOpen } from '../components/icons';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-orange-500 dark:text-orange-400">{resource.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2"><BookOpen className="w-4 h-4"/> {resource.platform}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${resource.cost === 'Free' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                {resource.cost}
            </span>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Related Skills:</h4>
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
            <h1 className="text-4xl font-bold opacity-0 animate-fadeInUp">Expand Your Knowledge</h1>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md opacity-0 animate-fadeInUp animation-delay-200">
                 <select
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="p-2 border rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500"
                >
                    <option value="">Filter by Skill...</option>
                    {allSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                </select>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredResources.length > 0 ? (
                    filteredResources.map((res, index) => (
                        <div key={res.id} className="opacity-0 animate-fadeInUp" style={{ animationDelay: `${200 + index * 100}ms` }}>
                            <ResourceCard resource={res} />
                        </div>
                    ))
                ) : (
                    <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500 opacity-0 animate-fadeInUp">No resources match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default ResourcesPage;
