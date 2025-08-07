import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import { supabase } from "../services/supabaseClient";

const EditQuote = ({
  quoteId,
  initialQuoteText,
  initialAuthor,
  initialTags,
  initialSource,
  defaultCollectionId = "",
  onClose,
}) => {
  const [quoteText, setQuoteText] = useState(initialQuoteText || "");
  const [author, setAuthor] = useState(initialAuthor || "");
  const [source, setSource] = useState(initialSource || "");
  const [selectedCollectionId] = useState(defaultCollectionId);
  const [tags, setTags] = useState(initialTags || "");
  const [showToast, setShowToast] = useState(false);
  const [modalInstance, setModalInstance] = useState(null);

  // Show modal on mount
  useEffect(() => {
    const modalEl = document.getElementById("editQuoteModal");
    if (modalEl) {
      const modal = new Modal(modalEl, { backdrop: "static" });
      modal.show();
      setModalInstance(modal);
    }

    return () => {
      cleanupModal();
    };
  }, []);

  const cleanupModal = () => {
    document.body.classList.remove("modal-open");
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((el) => el.remove());
  };

  const closeModal = () => {
    if (modalInstance) {
      modalInstance.hide();
      cleanupModal();
    }
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Not authenticated");
      return;
    }

    const { error } = await supabase
      .from("quote")
      .update({
        text: quoteText,
        author: author || null,
        source: source || null,
        tags: tags || null,
        updated_at: new Date(),
      })
      .eq("id", quoteId);

    if (error) {
      alert("Update failed");
      console.error("Update error:", error);
      return;
    }

    setShowToast(true);

    setTimeout(() => {
      closeModal();
    }, 1000);

    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <div
        className="modal fade"
        id="editQuoteModal"
        tabIndex="-1"
        aria-labelledby="editQuoteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <h5 id="editQuoteModalLabel">Edit Quote:</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label>Quote Text*</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label>Author (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label>Source (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label>Tags (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary me-2">
                Update Quote
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>

      {showToast && (
        <div
          className="toast-container position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 2000 }}
        >
          <div className="toast align-items-center text-white bg-success border-0 show">
            <div className="d-flex">
              <div className="toast-body text-center w-100">
                Quote updated successfully!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditQuote;
