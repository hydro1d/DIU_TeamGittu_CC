import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendedJobs, getRecommendedResources } from '../services/apiService';
import { Job, Resource, Match } from '../types';
import { Briefcase, BookOpen } from '../components/icons';

const RecommendationCard: React.FC<{ match: Match<Job | Resource> }> = ({ match }) => {
    const isJob = 'company' in match.item;
    const linkTo = isJob ? `/jobs/${match.item.id}` : (match.item as Resource).url;

    const content = (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {isJob ? (match.item as Job).title : match.item.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {isJob ? (match.item as Job).company : (match.item as Resource).platform}
            </p>
            <div className="mt-auto pt-2">
                <p className="text-xs font-semibold text-green-600 dark:text-green-400">Matches your skills:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {match.matchingSkills.map(skill => (
                        <span key={skill} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    return isJob ? <Link to={linkTo}>{content}</Link> : <a href={linkTo} target="_blank" rel="noopener noreferrer">{content}</a>;
}


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<Match<Job>[]>([]);
  const [recommendedResources, setRecommendedResources] = useState<Match<Resource>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [jobs, resources] = await Promise.all([
            getRecommendedJobs(), 
            getRecommendedResources()
        ]);
        setRecommendedJobs(jobs.slice(0, 3));
        setRecommendedResources(resources.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;
  if (!user) return <div>Please log in.</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.fullName}!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Here's a summary of your profile and top recommendations.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
            <div className="space-y-3 text-sm">
                <p><strong>Career Track:</strong> {user.careerTrack}</p>
                <p><strong>Experience:</strong> {user.experienceLevel}</p>
                <p><strong>Top Skills:</strong></p>
                <div className="flex flex-wrap gap-2">
                    {user.skills.slice(0,5).map(skill => (
                        <span key={skill} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">{skill}</span>
                    ))}
                    {user.skills.length > 5 && <span className="text-xs text-gray-500">...and more</span>}
                </div>
            </div>
            <Link to="/profile" className="mt-6 inline-block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Edit Profile
            </Link>
        </div>

        <div className="md:col-span-2 space-y-6">
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2"><Briefcase /> Recommended Jobs</h2>
                    <Link to="/jobs" className="text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
                </div>
                {recommendedJobs.length > 0 ? (
                     <div className="grid sm:grid-cols-1 gap-4">
                        {recommendedJobs.map(match => <RecommendationCard key={match.item.id} match={match} />)}
                    </div>
                ) : <p>No job recommendations found based on your profile.</p>}
            </section>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2"><BookOpen /> Recommended Resources</h2>
                    <Link to="/resources" className="text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
                </div>
                 {recommendedResources.length > 0 ? (
                     <div className="grid sm:grid-cols-1 gap-4">
                        {recommendedResources.map(match => <RecommendationCard key={match.item.id} match={match} />)}
                    </div>
                ) : <p>No resource recommendations found based on your profile.</p>}
            </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;