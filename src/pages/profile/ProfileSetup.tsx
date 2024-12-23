// src/pages/profile/ProfileSetup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/auth/authService';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'chef'>('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile({ ...formData, userType });
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update failed', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Profile Setup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            User Type:
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'customer' | 'chef')}
            >
              <option value="customer">Customer</option>
              <option value="chef">Chef</option>
            </select>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}