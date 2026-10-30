'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Maximize2,
  FileText,
  Wheat,
  Droplets,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface FarmerProfileTrackerProps {
  profile: FarmerProfile;
  language?: Language;
  onUpdateProfile: (updated: FarmerProfile) => void;
}

export const FarmerProfileTracker: React.FC<FarmerProfileTrackerProps> = ({
  profile,
  onUpdateProfile
}) => {
  const { dict } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<FarmerProfile>({ ...profile });

  // Calculate completion percentage based on 5 primary slots
  const slotsStatus = [
    { key: 'district', label: dict.slots.district, icon: MapPin, value: profile.district, isFilled: !!profile.district },
    { key: 'land_area_acres', label: dict.slots.land_area_acres, icon: Maximize2, value: profile.land_area_acres ? `${profile.land_area_acres} Acres` : null, isFilled: profile.land_area_acres !== null && profile.land_area_acres !== undefined },
    { key: 'ownership_type', label: dict.slots.ownership_type, icon: FileText, value: profile.ownership_type ? dict.ownershipLabels[profile.ownership_type] : null, isFilled: !!profile.ownership_type },
    { key: 'crops', label: dict.slots.crops, icon: Wheat, value: profile.crops && profile.crops.length > 0 ? profile.crops.join(', ') : null, isFilled: profile.crops && profile.crops.length > 0 },
    { key: 'has_irrigation', label: dict.slots.has_irrigation, icon: Droplets, value: profile.has_irrigation === true ? dict.irrigationLabels.yes : profile.has_irrigation === false ? dict.irrigationLabels.no : null, isFilled: profile.has_irrigation !== null && profile.has_irrigation !== undefined }
  ];

  const filledCount = slotsStatus.filter((s) => s.isFilled).length;
  const percentage = Math.round((filledCount / slotsStatus.length) * 100);

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4 sm:p-5 transition hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {filledCount}/{slotsStatus.length}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              {dict.profileTitle}
            </h2>
            <p className="text-xs text-gray-500">
              {dict.profileCompletion}: <span className="font-semibold text-emerald-700">{percentage}%</span>
            </p>
          </div>
        </div>

        {/* Progress Bar & Edit Button */}
        <div className="flex items-center space-x-3">
          <div className="w-32 sm:w-44 bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {!isEditing ? (
            <button
              onClick={() => {
                setTempProfile({ ...profile });
                setIsEditing(true);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
            >
              <Edit3 className="w-3 h-3 text-emerald-700" />
              <span>{dict.editProfile}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs font-bold rounded bg-emerald-600 text-white hover:bg-emerald-700 flex items-center space-x-1"
              >
                <Check className="w-3 h-3" />
                <span>{dict.saveProfile}</span>
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs font-medium rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Normal View: Slots Grid */}
      {!isEditing ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
          {slotsStatus.map((slot) => {
            const Icon = slot.icon;
            return (
              <div
                key={slot.key}
                className={`p-3 rounded-xl border transition ${
                  slot.isFilled
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                    : 'bg-amber-50/60 border-dashed border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-medium text-gray-500">
                    <Icon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{slot.label}</span>
                  </div>
                  {slot.isFilled ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </div>
                <div className="text-xs sm:text-sm font-bold truncate">
                  {slot.isFilled ? (
                    slot.value
                  ) : (
                    <span className="text-amber-700 font-normal italic">
                      {dict.missingTag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Inline Quick Edit Form */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">{dict.slots.district}</label>
            <input
              type="text"
              value={tempProfile.district || ''}
              onChange={(e) => setTempProfile({ ...tempProfile, district: e.target.value })}
              placeholder="e.g. Belagavi"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">{dict.slots.land_area_acres}</label>
            <input
              type="number"
              step="0.1"
              value={tempProfile.land_area_acres || ''}
              onChange={(e) => setTempProfile({ ...tempProfile, land_area_acres: parseFloat(e.target.value) || null })}
              placeholder="e.g. 3.5"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">{dict.slots.ownership_type}</label>
            <select
              value={tempProfile.ownership_type || ''}
              onChange={(e) => setTempProfile({ ...tempProfile, ownership_type: (e.target.value as any) || null })}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">-- {dict.missingTag} --</option>
              <option value="owner">{dict.ownershipLabels.owner}</option>
              <option value="tenant">{dict.ownershipLabels.tenant}</option>
              <option value="sharecropper">{dict.ownershipLabels.sharecropper}</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">{dict.slots.crops}</label>
            <input
              type="text"
              value={tempProfile.crops ? tempProfile.crops.join(', ') : ''}
              onChange={(e) =>
                setTempProfile({
                  ...tempProfile,
                  crops: e.target.value.split(',').map((c) => c.trim()).filter(Boolean)
                })
              }
              placeholder="paddy, sugarcane, ragi"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">{dict.slots.has_irrigation}</label>
            <select
              value={tempProfile.has_irrigation === true ? 'yes' : tempProfile.has_irrigation === false ? 'no' : ''}
              onChange={(e) =>
                setTempProfile({
                  ...tempProfile,
                  has_irrigation: e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null
                })
              }
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">-- {dict.missingTag} --</option>
              <option value="yes">{dict.irrigationLabels.yes}</option>
              <option value="no">{dict.irrigationLabels.no}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

