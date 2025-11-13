
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/apiService';
import { Job } from '../types';
import { MapPin, Briefcase } from '../components/icons';

const JobDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadJob = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const fetchedJob = await getJobById(id);
                setJob(fetchedJob);
            } catch (error) {
                console.error("Failed to fetch job details", error);
            } finally {
                setLoading(false);
            }
        };
        loadJob();
    }, [id]);

    if (loading) return <div>Loading job details...</div>;
    if (!job) return <div>Job not found. <Link to="/jobs" className="text-indigo-600">Go back to jobs list.</Link></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">{job.company}</p>
                </div>
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${job.jobType === 'Full-time' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                    {job.jobType}
                </span>
            </div>

            <div className="flex items-center gap-4 text-md text-gray-500 dark:text-gray-400 mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {job.location}</div>
                <div className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> {job.experienceLevel}</div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
                <p>{job.description}</p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                    {job.requiredSkills.map(skill => (
                        <span key={skill} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-center">
                <a href="#" className="inline-block bg-indigo-600 text-white font-bold px-12 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
                    Apply Now
                </a>
            </div>
             <div className="mt-8">
                <Link to="/jobs" className="text-indigo-600 dark:text-indigo-400 hover:underline">&larr; Back to all jobs</Link>
            </div>
        </div>
    );
};

export default JobDetailPage;
