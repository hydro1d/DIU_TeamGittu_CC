
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById, getRecommendedResourcesForSkills } from '../services/apiService';
import { Job, Resource } from '../types';
import { MapPin, Briefcase, BookOpen } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

const JobDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [recommendedCourses, setRecommendedCourses] = useState<Resource[]>([]);
    const [isFetchingCourses, setIsFetchingCourses] = useState(false);


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

    const userSkills = new Set((user?.skills || []).map(s => s.toLowerCase()));
    const requiredSkills = job?.requiredSkills || [];
    const matchingSkills = new Set(requiredSkills.filter(skill => userSkills.has(skill.toLowerCase())));
    const matchingScore = requiredSkills.length > 0 ? Math.round((matchingSkills.size / requiredSkills.length) * 100) : 0;
    const canApply = matchingScore >= 70;
    const missingSkills = requiredSkills.filter(skill => !userSkills.has(skill.toLowerCase()));
    
    useEffect(() => {
        const fetchRecommendedCourses = async () => {
            if (job && user) {
                const userSkills = new Set((user.skills || []).map(s => s.toLowerCase()));
                const requiredSkills = job.requiredSkills || [];
                const localMatchingScore = requiredSkills.length > 0 ? Math.round((new Set(requiredSkills.filter(skill => userSkills.has(skill.toLowerCase()))).size / requiredSkills.length) * 100) : 0;
                const localMissingSkills = requiredSkills.filter(skill => !userSkills.has(skill.toLowerCase()));

                if (localMatchingScore < 70 && localMissingSkills.length > 0) {
                    setIsFetchingCourses(true);
                    try {
                        const courses = await getRecommendedResourcesForSkills(localMissingSkills);
                        setRecommendedCourses(courses);
                    } catch (error) {
                        console.error("Failed to fetch recommended courses", error);
                        setRecommendedCourses([]);
                    } finally {
                        setIsFetchingCourses(false);
                    }
                } else {
                    setRecommendedCourses([]);
                }
            } else {
                setRecommendedCourses([]);
            }
        };
        fetchRecommendedCourses();
    }, [job, user]);

    const scoreColorClass =
        matchingScore >= 70
            ? 'text-green-500'
            : matchingScore >= 40
            ? 'text-yellow-500'
            : 'text-red-500';
    
    const progressColorClass =
        matchingScore >= 70
            ? 'bg-green-500'
            : matchingScore >= 40
            ? 'bg-yellow-500'
            : 'bg-red-500';

    if (loading) return <div className="text-center p-8">Loading job details...</div>;
    if (!job) return <div className="text-center p-8">Job not found. <Link to="/jobs" className="text-orange-500">Go back to jobs list.</Link></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300">{job.company}</p>
                </div>
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                    {job.jobType}
                </span>
            </div>
            <div className="flex items-center gap-4 text-md text-gray-500 dark:text-gray-400 mb-6 border-b pb-4 dark:border-gray-700">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {job.location}</span>
                <span className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> {job.experienceLevel}</span>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-3">Job Description</h2>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{job.description}</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-3">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {requiredSkills.map(skill => (
                            <span key={skill} className={`px-3 py-1 rounded-full text-sm font-medium ${matchingSkills.has(skill.toLowerCase()) ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ring-1 ring-green-500' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
                        <h3 className="text-lg font-bold text-center mb-4">Your Match Score</h3>
                        <div className="text-center mb-2">
                            <span className={`text-4xl font-bold ${scoreColorClass}`}>{matchingScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className={`${progressColorClass} h-2.5 rounded-full`} style={{ width: `${matchingScore}%` }}></div>
                        </div>
                        <p className="text-center text-sm mt-3 text-gray-600 dark:text-gray-400">
                            You have {matchingSkills.size} of {requiredSkills.length} required skills.
                        </p>
                    </div>

                    <div className="text-center">
                        <button 
                            disabled={!canApply}
                            className="w-full px-6 py-3 font-bold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                            onClick={() => alert('Application feature is a work in progress!')}
                            aria-label={canApply ? 'Apply for this job' : `Match score is below 70%, application disabled`}
                        >
                            Apply Now
                        </button>
                        {!canApply && (
                            <>
                                <p className="mt-3 text-sm text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-2 rounded-md">
                                    Your match score is below 70%. We recommend improving your skills before applying.
                                </p>
                                <div className="mt-4 p-4 text-left bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Missing Skills:</h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {missingSkills.map(skill => (
                                                <span key={skill} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Recommended Courses:</h4>
                                        {isFetchingCourses ? (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Finding relevant courses...</p>
                                        ) : recommendedCourses.length > 0 ? (
                                            <ul className="space-y-2 mt-2">
                                                {recommendedCourses.map(course => (
                                                    <li key={course.id}>
                                                        <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 dark:text-orange-400 hover:underline flex items-center gap-2 group">
                                                            <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
                                                            <span>{course.title} ({course.platform})</span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No specific courses found for these skills. Check the <Link to="/resources" className="underline font-medium">Resources</Link> page.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <Link to="/jobs" className="text-orange-500 dark:text-orange-400 hover:underline">&larr; Back to all jobs</Link>
            </div>
        </div>
    );
};

export default JobDetailPage;
