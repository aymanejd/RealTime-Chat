
import { useState } from "react";
import { AuthStore } from "../Store/AuthStore";
import { Camera, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, updateProfile,updateProfilePic, isUpdatingProfile } = AuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disablebutton, setdisablebutton] = useState(true);
  const [oldnameequaltonew, setoldnameequaltonew] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const baseImage = reader.result;
      setSelectedImg(baseImage); // Save baseImage in state      setSelectedImg(baseImage);
      await updateProfilePic({ profilePic: baseImage });

    };

  };
  
  const checkButtonState = (updatedName, updatedEmail) => {
    const isNameUnchanged = updatedName.trim() === authUser?.fullName;
    const isEmailUnchanged = updatedEmail.trim() === authUser?.email;
    setdisablebutton(isNameUnchanged && isEmailUnchanged);
   

  };

  const usernampdate = (value) => {
    setName(value);
    checkButtonState(value, email || authUser?.email);
  };

  const useremailpdate = (value) => {
    setEmail(value);
    checkButtonState(Name || authUser?.fullName, value);
  };
  const UpdateUserProfile = async () => {
    if (disablebutton) {
      toast.error("you are not smart then me !! ");
      return false;
    }
  const emailforupdate= !email ?authUser?.email : email
  const nameforupdate= !Name ?authUser?.fullName: Name

    if (!/\S+@\S+\.\S+/.test(emailforupdate)) {
      toast.error("Invalid email format ");
      return false;
    }

     await updateProfile({ fullName: nameforupdate, email: emailforupdate });
      
    

  }
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>


          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name

              </div>
              <input
                type="text"
                className={` text-center px-4 py-2.5 bg-base-200 w-full pl-10 rounded-lg border`}
                placeholder="Your Name"
                value={Name ? Name : authUser?.fullName}
                onChange={(e) => usernampdate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address

              </div>
              <input
                type="text"
                className={` text-center px-4 py-2.5 bg-base-200 w-full pl-10 rounded-lg border`}
                placeholder="Your Name"
                value={email ? email : authUser?.email}
                onChange={(e) => useremailpdate(e.target.value)}

              />
            </div>
          </div>
          <div className="flex justify-end">
            <button style={disablebutton ? { cursor: "not-allowed" } : { cursor: "pointer" }} className="btn btn-primary"
              disabled={disablebutton} onClick={() => UpdateUserProfile()}
            >Primary</button>

          </div>
        </div>

        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium  mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};
export default Profile;
