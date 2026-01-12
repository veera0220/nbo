export default function MyProfile() {
  const profileData = [
    ["Prefix", "Mr."],
    ["First Name", "Umesh"],
    ["Last Name", "GD"],
    ["Email Address", "umesh.gd.ext@digitusbiz.com"],
    ["Job Title", "Other"],
    ["Company Name", "Astec Components Limited"],
    ["Business Phone", "0000000000"],
  ];

  return (
    <div className="max-w-[650px] bg-white border border-gray-300 p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">
        My Profile
      </h2>

      {profileData.map(([label, value]) => (
        <div
          key={label}
          className="profile-row flex items-start gap-2 mb-1"
        >
          <span className="label w-[140px] text-left font-medium text-gray-600">
            {label}
          </span>
          <span className="colon font-medium text-gray-600">:</span>
          <span className="value text-gray-800 leading-6">
            {value}
          </span>
        </div>
      ))}

      {/* Site Address */}
      <div className="profile-row flex items-start gap-2 mb-6">
        <span className="label w-[140px] text-left font-medium text-gray-600">
          Site Address
        </span>
        <span className="colon font-medium text-gray-600">:</span>
        <span className="value text-gray-800 leading-6">
          3-3425 Laird Road<br />
          Mississauga, Ontario L5L 5R8<br />
          Canada
        </span>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-600 mt-6">
        <strong>Has your information changed?</strong>
        <br />
        If so, please contact us at either
        <br />
        <a
          href="mailto:marketing.operations@amphenol-fci.com"
          className="text-blue-600 hover:underline"
        >
          marketing.operations@amphenol-fci.com
        </a>
      </div>
    </div>
  );
}
