import Skeleton from "@mui/material/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="w-full max-w-2xl rounded-2xl p-6 shadow-lg">
      <div className="border-b pb-5">
        <Skeleton variant="text" width={100} height={36} />
        <Skeleton variant="text" width={280} height={24} />
      </div>

      <div className="flex flex-col items-center gap-3 py-8">
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton variant="rounded" width={140} height={40} />
        <Skeleton variant="text" width={100} height={20} />
      </div>

      <div className="border-t pt-6">
        <Skeleton variant="text" width={180} height={30} />

        <div className="flex items-center justify-between border-b py-4">
          <div>
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={150} height={26} />
          </div>

          <Skeleton variant="rounded" width={100} height={40} />
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <Skeleton variant="text" width={60} height={20} />
            <Skeleton variant="text" width={200} height={26} />
          </div>

          <Skeleton variant="rounded" width={100} height={40} />
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        <Skeleton variant="text" width={110} height={30} />
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rounded" width={100} height={40} />
        </div>
      </div>
    </div>
  );
}