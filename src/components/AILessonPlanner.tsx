// AILessonPlanner.tsx

import React, { useState } from 'react';
import { Brain, FileText, Clock, Users, Target, Download } from 'lucide-react';
import Card from './Card';
import Button from './Button';

function AILessonPlanner() {
  const [lessonTopic, setLessonTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const gradeLevels = [
    'Elementary (K-5)',
    'Middle School (6-8)',
    'High School (9-12)',
    'College/University'
  ];

  const durations = ['30 minutes', '45 minutes', '60 minutes', '90 minutes'];

  const generateLessonPlan = async () => {
    if (!lessonTopic || !gradeLevel || !duration) {
      setError('Please fill out all fields.');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: lessonTopic,
          grade: gradeLevel,
          duration: duration
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lesson plan.');
      }

      const data = await response.json();
      setGeneratedPlan(data);
    } catch (err) {
      console.error('Error generating lesson plan:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/export-lesson-plan-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatedPlan),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedPlan.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lesson_plan.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Could not export to PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">AI Lesson Planner</h2>
        </div>

        {/* Input Form */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Topic
            </label>
            <input
              type="text"
              value={lessonTopic}
              onChange={(e) => setLessonTopic(e.target.value)}
              placeholder="e.g., Quadratic Equations, Photosynthesis..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select grade level</option>
              {gradeLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select duration</option>
              {durations.map((dur) => (
                <option key={dur} value={dur}>{dur}</option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          onClick={generateLessonPlan}
          disabled={!lessonTopic || !gradeLevel || !duration || isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating Lesson Plan...' : 'Generate AI Lesson Plan'}
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </Card>

      {/* Generated Lesson Plan */}
      {generatedPlan && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">{generatedPlan.title}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                Save to Library
              </Button>
            </div>
          </div>

          {/* Lesson Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold">{generatedPlan.duration}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">{generatedPlan.objectives.length}</div>
              <div className="text-sm text-gray-600">Learning Objectives</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">{generatedPlan.activities.length}</div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Learning Objectives</h4>
            <ul className="list-disc list-inside space-y-2">
              {generatedPlan.objectives.map((objective: string, index: number) => (
                <li key={index} className="text-gray-700">{objective}</li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Materials Needed</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {generatedPlan.materials.map((material: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">{material}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Lesson Activities</h4>
            <div className="space-y-4">
              {generatedPlan.activities.map((activity: any, index: number) => (
                <div key={index} className="border-l-4 border-purple-400 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-semibold">{activity.name}</h5>
                    <span className="text-sm text-purple-600 font-medium">{activity.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Assessment Strategies</h4>
            <div className="space-y-2">
              {generatedPlan.assessment.map((item: string, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiation */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Differentiation Strategies</h4>
            <div className="space-y-2">
              {generatedPlan.differentiation.map((strategy: string, index: number) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700">{strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AILessonPlanner;