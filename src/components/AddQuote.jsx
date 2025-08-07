import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Modal } from "bootstrap";
import { supabase } from "../services/supabaseClient";

const AddQuote = ({ quoteToEdit = null, onClose }) => {
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // Load collections and set form values when quoteToEdit changes
  useEffect(() => {
    fetchCollections();

    if (quoteToEdit) {
      setQuoteText(quoteToEdit.text || "");
      setAuthor(quoteToEdit.author || "");
      setSource(quoteToEdit.source || "");
      setSelectedCollectionId(quoteToEdit.collection_id || "");
      checkIfFavorite();
    } else {
      resetForm();
    }
  }, [quoteToEdit]);

  // Fetch user collections
  const fetchCollections = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("collection")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching collections:", error);
      } else {
        setCollections(data);
      }
    }
  };

  // Check if the quote is favorited by the user
  const checkIfFavorite = async () => {
    if (!quoteToEdit) {
      setIsFavorite(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("favorite")
      .select("*")
      .eq("user_id", user.id)
      .eq("quote_id", quoteToEdit.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // Ignore "no rows found" error (PGRST116)
      console.error("Error checking favorite:", error);
      setIsFavorite(false);
    } else {
      setIsFavorite(!!data);
    }
  };

  // Reset form to initial empty state
  const resetForm = () => {
    setQuoteText("");
    setAuthor("");
    setSource("");
    setSelectedCollectionId("");
    setNewCollectionName("");
    setIsFavorite(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quoteText.trim()) {
      alert("Quote text is required.");
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User not found.");
        return;
      }

      // Handle collection creation if new collection name is given
      let collectionId = selectedCollectionId;

      if (!selectedCollectionId && newCollectionName.trim()) {
        const { data: newCollection, error: collError } = await supabase
          .from("collection")
          .insert([{ title: newCollectionName.trim(), user_id: user.id }])
          .select()
          .single();

        if (collError) {
          alert("Failed to add new collection.");
          console.error(collError);
          return;
        }
        collectionId = newCollection.id;
      }

      if (quoteToEdit) {
        // Update existing quote
        const { error: updateError } = await supabase
          .from("quote")
          .update({
            text: quoteText,
            author: author || null,
            source: source || null,
            collection_id: collectionId || null,
          })
          .eq("id", quoteToEdit.id);

        if (updateError) {
          alert("Failed to update quote.");
          console.error(updateError);
          return;
        }

        // Update favorite status
        if (isFavorite) {
          await supabase
            .from("favorite")
            .upsert([{ user_id: user.id, quote_id: quoteToEdit.id }]);
        } else {
          await supabase
            .from("favorite")
            .delete()
            .eq("user_id", user.id)
            .eq("quote_id", quoteToEdit.id);
        }
      } else {
        // Insert new quote
        const { data: quote, error: insertError } = await supabase
          .from("quote")
          .insert([
            {
              text: quoteText,
              author: author || null,
              source: source || null,
              user_id: user.id,
              collection_id: collectionId || null,
            },
          ])
          .select()
          .single();

        if (insertError) {
          alert("Failed to add quote.");
          console.error(insertError);
          return;
        }

        // Add to favorite if checked
        if (isFavorite && quote?.id) {
          const { error: favError } = await supabase
            .from("favorite")
            .insert([{ user_id: user.id, quote_id: quote.id }]);

          if (favError) {
            alert("Failed to add to favorites.");
            console.error(favError);
          }
        }
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      resetForm();

      // Close modal using Bootstrap Modal JS
      const modalElement = document.getElementById("addQuoteModal");
      let modalInstance = Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new Modal(modalElement);
      }
      modalInstance.hide();

      if (onClose) onClose();
    } catch (err) {
      alert("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <>
      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="addQuoteModal"
        tabIndex="-1"
        aria-labelledby="addQuoteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header justify-content-center position-relative">
              <h5 className="modal-title text-center w-100 fw-bold" id="addQuoteModalLabel">
                {quoteToEdit ? "Edit Quote" : "Add a New Quote"}
              </h5>
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  resetForm();
                  if (onClose) onClose();
                }}
              />
            </div>
            <div className="modal-body px-5">
              <form onSubmit={handleSubmit}>
                {/* Quote Text */}
                <div className="mb-3">
                  <label htmlFor="quoteText" className="form-label text-start w-100">
                    Quote Text <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="quoteText"
                    className="form-control"
                    rows={3}
                    required
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                  />
                </div>

                {/* Author and Source */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="quoteAuthor" className="form-label text-start w-100">
                      Author <em>(optional)</em>
                    </label>
                    <input
                      type="text"
                      id="quoteAuthor"
                      className="form-control"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="quoteSource" className="form-label text-start w-100">
                      Source <em>(optional)</em>
                    </label>
                    <input
                      type="text"
                      id="quoteSource"
                      className="form-control"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    />
                  </div>
                </div>

                {/* Collection and New Collection */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="quoteCollection" className="form-label text-start w-100">
                      Collection <em>(optional)</em>
                    </label>
                    <select
                      id="quoteCollection"
                      className="form-select"
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
                    <label htmlFor="newCollection" className="form-label text-start w-100">
                      Add to New Collection <em>(optional)</em>
                    </label>
                    <input
                      type="text"
                      id="newCollection"
                      className="form-control"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Favorite */}
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    id="addToFavorite"
                    className="form-check-input"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                  />
                  <label htmlFor="addToFavorite" className="form-check-label">
                    Add to Favorites
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="text-center">
                  <button type="submit" className="btn btn-primary me-2">
                    {quoteToEdit ? "Save Changes" : "Save Quote"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      resetForm();
                      if (onClose) onClose();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          className="toast-container position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 2000 }}
        >
          <div
            className="toast align-items-center text-white bg-success border-0 show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ minWidth: "250px" }}
          >
            <div className="d-flex">
              <div className="toast-body text-center w-100">
                Quote {quoteToEdit ? "updated" : "added"} successfully!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddQuote;
