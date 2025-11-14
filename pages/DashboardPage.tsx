
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendedJobs, getRecommendedResources } from '../services/apiService';
import { Job, Resource, Match } from '../types';
import { Briefcase, BookOpen, Rocket, Download } from '../components/icons';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateCareerRoadmap } from '../services/geminiService';

const RecommendationCard: React.FC<{ match: Match<Job | Resource> }> = ({ match }) => {
    const isJob = 'company' in match.item;
    const linkTo = isJob ? `/jobs/${match.item.id}` : (match.item as Resource).url;
    
    const scoreColorClass =
        typeof match.matchingScore === 'number'
            ? match.matchingScore >= 70
                ? 'text-green-500'
                : match.matchingScore >= 40
                ? 'text-yellow-500'
                : 'text-red-500'
            : 'text-gray-500';

    const progressColorClass =
        typeof match.matchingScore === 'number'
            ? match.matchingScore >= 70
                ? 'bg-green-500'
                : match.matchingScore >= 40
                ? 'bg-yellow-500'
                : 'bg-red-500'
            : 'bg-gray-500';

    const content = (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {isJob ? (match.item as Job).title : match.item.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {isJob ? (match.item as Job).company : (match.item as Resource).platform}
            </p>
            {isJob && typeof match.matchingScore === 'number' && (
                <div className="my-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Match Score</span>
                        <span className={`font-bold ${scoreColorClass}`}>{match.matchingScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                        <div className={`${progressColorClass} h-1.5 rounded-full`} style={{ width: `${match.matchingScore}%` }}></div>
                    </div>
                </div>
            )}
            <div className="mt-auto pt-2">
                <p className="text-xs font-semibold text-green-600 dark:text-green-400">Top match for you:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {match.matchingSkills.slice(0, 3).map(skill => (
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
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [targetRole, setTargetRole] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('3 months');

  useEffect(() => {
    if (user) {
        setTargetRole(user.careerTrack);
    }
  }, [user]);

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

  const handleGenerateRoadmap = async () => {
    if (!user || recommendedResources.length === 0) {
        setRoadmapError("We need your profile and some recommended resources to generate a roadmap.");
        return;
    };
    if (!targetRole.trim()) {
        setRoadmapError("Please enter a target role to generate your roadmap.");
        return;
    }
    setIsGeneratingRoadmap(true);
    setRoadmapError(null);
    setRoadmap(null);

    try {
        const fullResources = recommendedResources.map(match => match.item as Resource);
        const generatedRoadmap = await generateCareerRoadmap(user, fullResources, targetRole, timeframe);
        setRoadmap(generatedRoadmap);
    } catch (error) {
        if (error instanceof Error) {
            setRoadmapError(error.message);
        } else {
            setRoadmapError("An unknown error occurred while generating the roadmap.");
        }
    } finally {
        setIsGeneratingRoadmap(false);
    }
  };

  const handleDownloadPdf = () => {
    const input = roadmapRef.current;
    if (!input) return;

    // Give the browser time to render the content before capturing
    setTimeout(() => {
        html2canvas(input, { 
            scale: 2,
            useCORS: true,
            backgroundColor: document.body.classList.contains('dark') ? '#111827' : '#ffffff' 
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            const pdfImageHeight = pdfWidth / ratio;
            let heightLeft = imgHeight * (pdfWidth / imgWidth);
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
                position -= pdf.internal.pageSize.getHeight();
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save(`Career-Roadmap-${user?.fullName.replace(/\s/g, '-')}.pdf`);
        });
    }, 200);
  };

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

      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-indigo-500" /> Your AI-Powered Career Roadmap
                </h2>
                {roadmap && !isGeneratingRoadmap && (
                    <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                       <Download className="w-4 h-4" /> Download PDF
                    </button>
                )}
            </div>

            {isGeneratingRoadmap && (
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Crafting your personal career path with AI...</p>
                </div>
            )}
            {roadmapError && <p className="text-red-500 bg-red-100 dark:bg-red-900 p-3 rounded-md">{roadmapError}</p>}

            {!roadmap && !isGeneratingRoadmap && !roadmapError && (
                <div className="text-center p-8">
                    <p className="mb-6 text-gray-600 dark:text-gray-300">Get a step-by-step plan to achieve your career goals, tailored just for you.</p>
                    <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                        <div>
                            <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Target Role</label>
                            <input
                                id="targetRole"
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Frontend Developer"
                                className="mt-1 block w-full p-2 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Desired Timeframe</label>
                            <select
                                id="timeframe"
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="3 months">3 Months</option>
                                <option value="6 months">6 Months</option>
                                <option value="1 year">1 Year</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={handleGenerateRoadmap}
                        disabled={!targetRole.trim() || isGeneratingRoadmap}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Generate My Roadmap
                    </button>
                </div>
            )}
            
            {roadmap && (
                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <div ref={roadmapRef} className="prose dark:prose-invert max-w-none p-4" dangerouslySetInnerHTML={{ __html: marked.parse(roadmap) as string }}>
                    </div>
                 </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
