import React from "react";

function modalLogic() {
  const KEY = "dontShowBrandNewModal";

  const dontShowModal = localStorage.getItem(KEY);

  if (dontShowModal) {
    return;
  }

  const modal = document.getElementById("brand_new_modal");

  if (modal) {
    const button = modal.querySelector("button");

    button!.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("hidden");
      localStorage.setItem(KEY, "true");
    });

    modal.classList.remove("hidden");
  }
}

function BrandNewModal() {
  return (
    <>
      <div
        id="brand_new_modal"
        className="hidden fixed top-0 left-0 w-full h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 9999999 }}
      >
        <div className="max-w-full mx-auto w-64 sm:w-96 mt-16 bg-focal p-4 border-2 border-white">
          <h1 className="text-2xl font-bold text-white mb-4 w-full text-center">
            This site is brand new
          </h1>
          <div className="flex flex-col items-center space-y-2">
            <p className="w-full">
              If you see anything wrong, please use "report an issue" to let me
              know, thanks!
            </p>
            <button className="py-2 px-4 bg-focal-400 text-white font-bold mt-4 hover:bg-focal-300 hover:text-focal">
              ok
            </button>
          </div>
        </div>
      </div>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `${modalLogic.toString()}; modalLogic();`,
        }}
      />
    </>
  );
}

export { BrandNewModal };
