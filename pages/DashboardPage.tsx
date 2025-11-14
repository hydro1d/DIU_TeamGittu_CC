
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendedJobs, getRecommendedResources } from '../services/apiService';
import { Job, Resource, Match } from '../types';
import { Briefcase, BookOpen, Rocket, Download, CheckCircle } from '../components/icons';
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
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
            <h4 className="text-lg font-bold text-orange-500 dark:text-orange-400">
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

  const profileCompletion = useMemo(() => {
    if (!user) return { score: 0, percentage: 0 };
    let score = 0;
    const totalChecks = 6;

    if (user.education?.trim()) score++;
    if (user.careerTrack?.trim()) score++;
    if (user.skills?.length >= 3) score++;
    if (user.projects?.trim()) score++;
    if (user.careerInterests?.trim()) score++;
    if (user.cvNotes?.trim()) score++;
    
    return { score, percentage: Math.round((score / totalChecks) * 100) };
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md opacity-0 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.fullName}!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Here's a summary of your profile and top recommendations.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md opacity-0 animate-fadeInUp animation-delay-200">
            <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
             <div className="space-y-4 text-sm">
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Education</p>
                    <p className="text-gray-800 dark:text-gray-200">{user.education || <span className="italic text-gray-500">Not specified</span>}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Career Track</p>
                    <p className="text-gray-800 dark:text-gray-200">{user.careerTrack || <span className="italic text-gray-500">Not specified</span>}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Experience</p>
                    <p className="text-gray-800 dark:text-gray-200">{user.experienceLevel}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Interests</p>
                    <p className="text-gray-800 dark:text-gray-200">{user.careerInterests || <span className="italic text-gray-500">Not specified</span>}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400 mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {user.skills.length > 0 ? (
                            <>
                                {user.skills.slice(0,5).map(skill => (
                                    <span key={skill} className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">{skill}</span>
                                ))}
                                {user.skills.length > 5 && <span className="text-xs text-gray-500 self-center">...and more</span>}
                            </>
                        ) : (
                            <p className="italic text-gray-500 text-xs">No skills added yet.</p>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="mt-6 border-t pt-4 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Profile Completion</span>
                    <span className="font-bold text-orange-500">{profileCompletion.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${profileCompletion.percentage}%` }}
                    ></div>
                </div>
                {profileCompletion.percentage < 100 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Complete your profile to get better recommendations!
                    </p>
                )}
                {profileCompletion.percentage === 100 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Your profile is complete!
                    </p>
                )}
            </div>

            <Link to="/profile" className="mt-6 inline-block w-full text-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                {profileCompletion.percentage < 100 ? 'Complete Profile' : 'Edit Profile'}
            </Link>
        </div>

        <div className="md:col-span-2 space-y-6">
            <section className="opacity-0 animate-fadeInUp animation-delay-400">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2"><Briefcase /> Recommended Jobs</h2>
                    <Link to="/jobs" className="text-orange-500 dark:text-orange-400 hover:underline">View All</Link>
                </div>
                {recommendedJobs.length > 0 ? (
                     <div className="grid sm:grid-cols-1 gap-4">
                        {recommendedJobs.map(match => <RecommendationCard key={match.item.id} match={match} />)}
                    </div>
                ) : <p>No job recommendations found based on your profile.</p>}
            </section>

            <section className="opacity-0 animate-fadeInUp animation-delay-600">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2"><BookOpen /> Recommended Resources</h2>
                    <Link to="/resources" className="text-orange-500 dark:text-orange-400 hover:underline">View All</Link>
                </div>
                 {recommendedResources.length > 0 ? (
                     <div className="grid sm:grid-cols-1 gap-4">
                        {recommendedResources.map(match => <RecommendationCard key={match.item.id} match={match} />)}
                    </div>
                ) : <p>No resource recommendations found based on your profile.</p>}
            </section>
        </div>
      </div>

      <div className="mt-8 opacity-0 animate-fadeInUp animation-delay-800">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-orange-500" /> Your AI-Powered Career Roadmap
                </h2>
                {roadmap && !isGeneratingRoadmap && (
                    <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                       <Download className="w-4 h-4" /> Download PDF
                    </button>
                )}
            </div>

            {isGeneratingRoadmap && (
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
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
                                className="mt-1 block w-full p-2 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Desired Timeframe</label>
                            <select
                                id="timeframe"
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-600 focus:ring-orange-500 focus:border-orange-500"
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
                        className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed animate-pulse-glow">
                        Generate My Roadmap
                    </button>
                </div>
            )}
            
            {roadmap && (
                 <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md opacity-0 animate-fadeInUp">
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
