const DateSeparator = ({ date }: { date: Date }) => {
  return (
    <div className="flex justify-center my-6">
      <span className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full font-medium">
        {date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    </div>
  );
};

export default DateSeparator;
