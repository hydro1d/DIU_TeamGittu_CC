
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../services/apiService';
import { Job, JobType, ExperienceLevel } from '../types';
import { MapPin, Briefcase } from '../components/icons';

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{job.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{job.company}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.jobType === JobType.FullTime ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {job.jobType}
            </span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4" /> <span>{job.location}</span>
            <Briefcase className="w-4 h-4 ml-2" /> <span>{job.experienceLevel}</span>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-sm">Required Skills:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {job.requiredSkills.map(skill => (
                    <span key={skill} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                ))}
            </div>
        </div>
        <div className="mt-6 text-right">
            <Link to={`/jobs/${job.id}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View Details &rarr;
            </Link>
        </div>
    </div>
);


const JobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ role: '', location: '', type: '' });

    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            try {
                const fetchedJobs = await getJobs();
                setJobs(fetchedJobs);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => 
            (filters.role === '' || job.title.toLowerCase().includes(filters.role.toLowerCase())) &&
            (filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
            (filters.type === '' || job.jobType === filters.type)
        );
    }, [jobs, filters]);

    if (loading) return <div>Loading jobs...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Find Your Next Opportunity</h1>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    name="role"
                    placeholder="Filter by role (e.g., Developer)"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Filter by location (e.g., Remote)"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                    <option value="">All Types</option>
                    {Object.values(JobType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                ) : (
                    <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500">No jobs match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default JobsPage;
