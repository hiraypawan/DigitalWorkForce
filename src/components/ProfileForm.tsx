'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileUpdateSchema, ProfileUpdateData } from '@/lib/validators';
import { Plus, X, Save } from 'lucide-react';

interface ProfileFormProps {
  initialData?: Partial<ProfileUpdateData>;
  onSave?: (data: ProfileUpdateData) => void;
}

export default function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: initialData?.name || '',
      aboutMe: initialData?.aboutMe || '',
      skills: initialData?.skills || [],
      hobbies: initialData?.hobbies || [],
      experience: initialData?.experience || [],
      portfolioLinks: initialData?.portfolioLinks || [],
    },
  });

  // Separate useFieldArray for each field type
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    name: "skills" as any,
    control
  });

  const {
    fields: hobbyFields,
    append: appendHobby,
    remove: removeHobby,
  } = useFieldArray({
    name: "hobbies" as any,
    control
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    name: "experience",
    control
  });

  const {
    fields: portfolioFields,
    append: appendPortfolio,
    remove: removePortfolio,
  } = useFieldArray({
    name: "portfolioLinks" as any,
    control
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSave?.(data);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Professional Profile</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
        </div>

        {/* About Me */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Me
          </label>
          <textarea
            {...register('aboutMe')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself, your background, and what you're passionate about..."
          />
          {errors.aboutMe && <p className="text-red-500 text-sm mt-1">{errors.aboutMe.message}</p>}
        </div>

        {/* Skills */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            <button
              type="button"
              onClick={() => (appendSkill as any)('')}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" /> Add Skill
            </button>
          </div>
          <div className="space-y-2">
            {skillFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`skills.${index}` as const)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., JavaScript, React, Python"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Hobbies & Interests
            </label>
            <button
              type="button"
              onClick={() => (appendHobby as any)('')}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Plus className="w-4 h-4" /> Add Hobby
            </button>
          </div>
          <div className="space-y-2">
            {hobbyFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`hobbies.${index}` as const)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Reading, Gaming, Photography"
                />
                <button
                  type="button"
                  onClick={() => removeHobby(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Work Experience
            </label>
            <button
              type="button"
              onClick={() => appendExperience({ title: '', company: '', duration: '', description: '' })}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Experience {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    {...register(`experience.${index}.title` as const)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Job Title"
                  />
                  <input
                    {...register(`experience.${index}.company` as const)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company Name"
                  />
                </div>
                <input
                  {...register(`experience.${index}.duration` as const)}
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                />
                <textarea
                  {...register(`experience.${index}.description` as const)}
                  rows={3}
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Job description and achievements..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Links */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Portfolio Links
            </label>
            <button
              type="button"
              onClick={() => (appendPortfolio as any)('')}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          <div className="space-y-2">
            {portfolioFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`portfolioLinks.${index}` as const)}
                  type="url"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://portfolio-link.com"
                />
                <button
                  type="button"
                  onClick={() => removePortfolio(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
