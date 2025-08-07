/* import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
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
  const [selectedCollectionId, setSelectedCollectionId] = useState(defaultCollectionId);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState(initialTags || "");
  const [showToast, setShowToast] = useState(false);

  // Fetch collections for dropdown
  useEffect(() => {
    const fetchCollections = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("collection")
          .select("*")
          .eq("user_id", user.id);
        if (error) console.error("Error fetching collections:", error);
        else setCollections(data);
      }
    };
    fetchCollections();
  }, []);

  // Fetch quote if initial values missing (optional, keeps form synced)
  useEffect(() => {
    const fetchQuote = async () => {
      if (!initialQuoteText || !initialAuthor || !initialTags) {
        const { data, error } = await supabase
          .from("quote")
          .select("*")
          .eq("id", quoteId)
          .single();
        if (error) {
          console.error("Failed to fetch quote:", error.message);
          return;
        }
        setQuoteText(data.text || "");
        setAuthor(data.author || "");
        setSource(data.source || "");
        setTags(data.tags || "");
        setSelectedCollectionId(data.collection_id || "");
      }
    };
    fetchQuote();
  }, [quoteId, initialQuoteText, initialAuthor, initialTags]);

  // Show Bootstrap modal on mount
  useEffect(() => {
    const modalElement = document.getElementById("editQuoteModal");
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();

      // Cleanup modal on unmount
      return () => {
        modalInstance.hide();
      };
    }
  }, []);

  // Handle form submit and update quote
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quoteText.trim()) {
      alert("Quote text is required.");
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Not authenticated.");
      return;
    }

    let collectionId = selectedCollectionId;

    // If user added a new collection, insert it first
    if (!collectionId && newCollectionName.trim()) {
      const { data: newCollection, error: collError } = await supabase
        .from("collection")
        .insert([{ title: newCollectionName.trim(), user_id: user.id }])
        .select()
        .single();

      if (collError) {
        alert("Error adding new collection.");
        console.error(collError);
        return;
      }

      collectionId = newCollection.id;
    }

    const { error: updateError } = await supabase
      .from("quote")
      .update({
        text: quoteText,
        author: author || null,
        source: source || null,
        collection_id: collectionId || null,
        tags: tags || null,
        updated_at: new Date(),
      })
      .eq("id", quoteId);

    if (updateError) {
      alert("Failed to update quote.");
      console.error(updateError);
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      const modalElement = document.getElementById("editQuoteModal");
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
      if (onClose) onClose();
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
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header justify-content-center position-relative">
              <h5
                className="modal-title text-center w-100 fw-bold"
                id="editQuoteModalLabel"
              >
                Edit Quote
              </h5>
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="quoteText" className="form-label">
                    Quote Text <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="quoteText"
                    rows="3"
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="quoteAuthor" className="form-label">
                      Author <em>(optional)</em>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="quoteAuthor"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="quoteSource" className="form-label">
                      Source <em>(optional)</em>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="quoteSource"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="quoteCollection" className="form-label">
                      Collection
                    </label>
                    <select
                      className="form-select"
                      id="quoteCollection"
                      value={selectedCollectionId}
                      onChange={(e) => setSelectedCollectionId(e.target.value)}
                    >
                      <option value="">Select existing collection...</option>
                      {collections.map((coll) => (
                        <option key={coll.id} value={coll.id}>
                          {coll.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="newCollection" className="form-label">
                      Add to New Collection
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="newCollection"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="tags" className="form-label">
                    Tags <em>(comma-separated)</em>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary me-2">
                    Update Quote
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div
          className="toast-container position-absolute top-50 start-50 translate-middle"
          style={{ zIndex: 2000 }}
        >
          <div
            className="toast align-items-center text-white bg-success border-0 show"
            role="alert"
          >
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
 */
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
  const [selectedCollectionId, setSelectedCollectionId] = useState(defaultCollectionId);
  const [tags, setTags] = useState(initialTags || "");
  const [showToast, setShowToast] = useState(false);

  // Show modal on mount
  useEffect(() => {
    console.log("EditQuote mounted, showing modal");
    const modalEl = document.getElementById("editQuoteModal");
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
      return () => modal.hide();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked, updating quote:", quoteId);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Not authenticated");
      console.error("Auth error:", authError);
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

    console.log("Quote updated successfully");
    setShowToast(true);
    setTimeout(() => {
      const modalEl = document.getElementById("editQuoteModal");
      const modal = Modal.getInstance(modalEl);
      if (modal) modal.hide();
      if (onClose) onClose();
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
           {/*  <h5 id="editQuoteModalLabel">Edit Quote (ID: {quoteId})</h5> */}
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
                data-bs-dismiss="modal"
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
