export default function BottomPane() {
  return (
    <div className="fixed bottom-0 flex w-full justify-center border-t ">
      <div className="">
        <input
          className="focus:shadow-outline w-full flex-grow border-none bg-transparent py-2 px-4 text-gray-700 focus:outline-none"
          placeholder="Type a message..."
          type="text"
        />
      </div>
      <div className="">
        <button className="focus:shadow-outline border-none bg-transparent py-2 px-4 text-gray-700 hover:bg-blue-500 hover:text-white focus:outline-none">
          Send
        </button>
      </div>
    </div>
  )
}
