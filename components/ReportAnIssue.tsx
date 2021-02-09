import React from "react";
import clsx from "clsx";

type ReportAnIssueProps = {
  className?: string;
};

function reportAnIssueLogic() {
  const a = document.getElementById("report_issue_anchor");
  const form = document.getElementById("report_issue_form");
  const modal = document.getElementById("report_issue_modal");
  const cancel = document.getElementById("report_issue_cancel");

  function reset() {
    if (a && form && modal && cancel) {
      form.classList.remove("hidden");
      form.querySelector("textarea")!.value = "";
      modal.classList.add("hidden");
      cancel.classList.remove("hidden");
      document.getElementById("report_issue_thanks")!.classList.add("hidden");
    }
  }

  if (a && form && modal && cancel) {
    cancel.addEventListener("click", () => {
      reset();
    });

    a.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    a.classList.remove("hidden");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const textarea = form.querySelector("textarea")!;

      const formData = {
        "entry.1405128730": textarea.value,
        "entry.665405350": window.location.toString(),
      };

      const encodedValues = Object.keys(formData).map((key) => {
        const encKey = encodeURIComponent(key);
        const encValue = encodeURIComponent(
          formData[key as keyof typeof formData]
        );
        return `${encKey}=${encValue}`;
      });

      const body = encodedValues.join("&").replace(/%20/g, "+");

      fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc42SYPQVGtnTd4VNr2N4S4WnRkoXm9A75b3DmnV1cP0P2gGQ/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        }
      ).then(() => {
        form.classList.add("hidden");
        cancel.classList.add("hidden");

        document
          .getElementById("report_issue_thanks")!
          .classList.remove("hidden");

        setTimeout(() => {
          modal.classList.add("hidden");
          reset();
        }, 2000);
      });
    });
  }
}

function ReportAnIssue({ className }: ReportAnIssueProps) {
  return (
    <>
      <a
        id="report_issue_anchor"
        className={clsx(className, "hidden cursor-pointer")}
      >
        report an issue
      </a>
      <div
        id="report_issue_modal"
        className="hidden fixed top-0 left-0 w-full h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 99999 }}
      >
        <div
          className="max-w-full mx-auto w-64 sm:w-96 mt-16 bg-focal-200 p-4"
          role="modal"
        >
          <h1 className="text-2xl font-bold text-focal mb-4 w-full text-center">
            Found something wrong?
          </h1>
          <form
            id="report_issue_form"
            className="flex flex-col items-center space-y-2"
          >
            <p>Please describe in detail</p>
            <textarea className="w-full text-black" rows={10} />
            <input
              type="submit"
              value="send"
              className="py-2 px-4 bg-focal-400 text-white font-bold mt-4 hover:bg-focal-300 hover:text-focal cursor-pointer"
            />
          </form>
          <a
            id="report_issue_cancel"
            className="block text-focal text-center w-full cursor-pointer"
          >
            cancel
          </a>
          <p
            id="report_issue_thanks"
            className="hidden text-focal text-2xl font-bold p-4 text-center"
          >
            Thanks!
          </p>
        </div>
      </div>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `${reportAnIssueLogic.toString()}; reportAnIssueLogic();`,
        }}
      />
    </>
  );
}

export { ReportAnIssue };
