export default function Users() {
  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8">Team Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-secondary p-6 sm:p-8 rounded-2xl border border-gray-800 lg:col-span-1">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Add Operator</h2>
          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="input-field" placeholder="Operator name" />
            </div>
            <div className="input-group">
              <label className="input-label">Access Level</label>
              <select className="input-field appearance-none">
                <option>Restricted Operator</option>
                <option>Full Administrator</option>
              </select>
            </div>
            <button className="btn btn-primary btn-md w-full mt-2 sm:mt-4">Create Account</button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* List of users placeholder */}
          <div className="bg-secondary p-6 sm:p-8 rounded-2xl border border-gray-800 border-dashed flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <p className="text-gray-500 italic text-sm sm:text-base">Operator list loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
