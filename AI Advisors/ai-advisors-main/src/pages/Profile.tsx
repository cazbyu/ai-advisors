import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store';
import { supabase } from '../supabase';

export function Profile() {
  const { user } = useAuth();
  const { companyProfile, setCompanyProfile } = useStore();

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (data) {
        setCompanyName(data.company_name || '');
        setIndustry(data.industry || '');
        setCompanySize(data.company_size || '');
        setCompanyDescription(data.company_description || '');
        setCompanyProfile({
          id: data.id,
          companyName: data.company_name || '',
          industry: data.industry || '',
          companySize: data.company_size || '',
          companyDescription: data.company_description || '',
        });
      }
    } catch (err) {
      console.log('No profile found, will create on save.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaved(false);

    try {
      const profileData = {
        id: user.id,
        company_name: companyName.trim(),
        industry: industry.trim(),
        company_size: companySize,
        company_description: companyDescription.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (error) throw error;

      setCompanyProfile({
        id: user.id,
        companyName: companyName.trim(),
        industry: industry.trim(),
        companySize: companySize,
        companyDescription: companyDescription.trim(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to set up your profile</h2>
          <p className="text-gray-500">Your company details help advisors give you tailored advice.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h1>
      <p className="text-gray-500 mb-6">
        Tell your advisors about your company so they can tailor their guidance to your specific situation.
      </p>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="e.g., Acme Corp"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <input
            type="text"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="e.g., Social enterprise, SaaS, Agriculture, Education"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
          <select
            value={companySize}
            onChange={e => setCompanySize(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select size...</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-1000">201-1,000 employees</option>
            <option value="1000+">1,000+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About Your Company</label>
          <p className="text-xs text-gray-400 mb-2">
            What does your company do? What's your mission? What stage are you at? The more context, the better your advisors can help.
          </p>
          <textarea
            value={companyDescription}
            onChange={e => setCompanyDescription(e.target.value)}
            placeholder="e.g., We're a social enterprise that empowers African entrepreneurs through microfinance and mentorship. Currently serving 500+ entrepreneurs across Kenya and Nigeria, looking to expand to 5 more countries in the next 2 years."
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            {saved && (
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Saved successfully
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Profile
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Account</h2>
        <div className="text-sm text-gray-600">
          <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
        </div>
      </div>
    </div>
  );
}
