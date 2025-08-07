// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import { Modal } from 'bootstrap';
// import { supabase } from "../services/supabaseClient";

// const AddQuote = () => {
//   const [quoteText, setQuoteText] = useState("");
//   const [author, setAuthor] = useState("");
//   const [source, setSource] = useState("");
//   const [selectedCollectionId, setSelectedCollectionId] = useState("");
//   const [newCollectionName, setNewCollectionName] = useState("");
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [collections, setCollections] = useState([]);
//   const [tags, setTags] = useState("");
//   const [showToast, setShowToast] = useState(false);

//   useEffect(() => {
//     const fetchCollections = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         const { data, error } = await supabase
//           .from("collection")
//           .select("*")
//           .eq("user_id", user.id);

//         if (data) setCollections(data);
//         else console.error("Error fetching collections:", error);
//       }
//     };

//     fetchCollections();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (!quoteText.trim()) {
//         alert("Quote text is required.");
//         return;
//       }

//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error("User not found:", userError);
//         alert("User not found.");
//         return;
//       }

//       let collectionId = selectedCollectionId;

//       if (!selectedCollectionId && newCollectionName.trim()) {
//         const { data: newCollection, error: collError } = await supabase
//           .from("collection")
//           .insert([{ title: newCollectionName.trim(), user_id: user.id }])
//           .select()
//           .single();

//         if (collError) {
//           console.error("Failed to add new collection:", collError.message);
//           alert("Error adding new collection.");
//           return;
//         }
//         collectionId = newCollection.id;
//       }

//       const { data: quote, error: quoteError } = await supabase
//         .from("quote")
//         .insert([
//           {
//             text: quoteText,
//             author: author || null,
//             source: source || null,
//             user_id: user.id,
//             collection_id: collectionId || null,
//           },
//         ])
//         .select()
//         .single();

//       if (quoteError) {
//         console.error("Error inserting quote:", quoteError.message);
//         alert("Failed to add quote.");
//         return;
//       }

//       if (isFavorite && quote?.id) {
//         const { error: favError } = await supabase
//           .from("favorite")
//           .insert([{ user_id: user.id, quote_id: quote.id }]);

//         if (favError) {
//           console.error("Failed to add to favorites:", favError.message);
//           alert("Failed to add to favorites.");
//         }
//       }

//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000); 

//       // Reset form
//       setQuoteText("");
//       setAuthor("");
//       setSource("");
//       setSelectedCollectionId("");
//       setNewCollectionName("");
//       setIsFavorite(false);

//       // Close modal
//       const modalElement = document.getElementById("addQuoteModal");
//       let modalInstance = Modal.getInstance(modalElement);
//       if (!modalInstance) {
//         modalInstance = new Modal(modalElement);
//       }
//       modalInstance.hide();
//     } catch (err) {
//       console.error("Unexpected error:", err.message);
//       alert("Something went wrong. See console for details.");
//     }
//   };   
    
//   return (
//     <>
//       {/* MODAL */}
//       <div
//         className="modal fade"
//         id="addQuoteModal"
//         tabIndex="-1"
//         aria-labelledby="addQuoteModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-xl modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header justify-content-center position-relative">
//               <h5 className="modal-title text-center w-100 fw-bold" id="addQuoteModalLabel">
//                 Add a New Quote
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close position-absolute top-0 end-0 m-3"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body px-5">
//               <form onSubmit={handleSubmit}>
//                 {/* Quote Text */}
//                 <div className="mb-3">
//                   <label htmlFor="quoteText" className="form-label text-start w-100">
//                     Quote Text <span className="text-danger">*</span>
//                   </label>
//                   <textarea
//                     className="form-control"
//                     id="quoteText"
//                     rows="3"
//                     required
//                     value={quoteText}
//                     onChange={(e) => setQuoteText(e.target.value)}
//                   ></textarea>
//                 </div>

//                 {/* Author and Source */}
//                 <div className="row mb-3">
//                   <div className="col-md-6">
//                     <label htmlFor="quoteAuthor" className="form-label text-start w-100">Author <em>(optional)</em></label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="quoteAuthor"
//                       value={author}
//                       onChange={(e) => setAuthor(e.target.value)}
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label htmlFor="quoteSource" className="form-label text-start w-100">Source <em>(optional)</em></label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="quoteSource"
//                       value={source}
//                       onChange={(e) => setSource(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Collection and New Collection */}
//                 <div className="row mb-3">
//                   <div className="col-md-6">
//                     <label htmlFor="quoteCollection" className="form-label text-start w-100">Collection <em>(optional)</em></label>
//                     <select
//                       className="form-select"
//                       id="quoteCollection"
//                       value={selectedCollectionId}
//                       onChange={(e) => setSelectedCollectionId(e.target.value)}
//                     >
//                       <option value="">Select existing collection...</option>
//                       {collections.map((coll) => (
//                         <option key={coll.id} value={coll.id}>
//                           {coll.title}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <label htmlFor="newCollection" className="form-label text-start w-100">Add to New Collection <em>(optional)</em></label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="newCollection"
//                       value={newCollectionName}
//                       onChange={(e) => setNewCollectionName(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Tags and Favorites */}
//                 <div className="row mb-4">
//                   <div className="col-md-8">
//                     <label htmlFor="tags" className="form-label text-start w-100">Tags <em>(comma-separated)</em></label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="tags"
//                       value={tags}
//                       onChange={(e) => setTags(e.target.value)}
//                       placeholder="e.g., motivation, happiness, productivity"
//                     />
//                   </div>
//                   <div className="col-md-4 d-flex align-items-end">
//                     <div className="form-check ms-3">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="addToFavorite"
//                         checked={isFavorite}
//                         onChange={(e) => setIsFavorite(e.target.checked)}
//                       />
//                       <label className="form-check-label" htmlFor="addToFavorite">
//                         Add to Favorites
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="text-center">
//                   <button type="submit" className="btn btn-primary me-2">
//                     Save Quote
//                   </button>
//                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* TOAST (Centered) */}
//       {showToast && (
//         <div
//           className="toast-container position-fixed top-50 start-50 translate-middle"
//           style={{ zIndex: 2000 }}
//         >
//           <div
//             className="toast align-items-center text-white bg-success border-0 show"
//             role="alert"
//             aria-live="assertive"
//             aria-atomic="true"
//             style={{ minWidth: "250px" }}
//           >
//             <div className="d-flex">
//               <div className="toast-body text-center w-100">
//                 Quote added successfully!
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default AddQuote;
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Modal } from "bootstrap";
import { supabase } from "../services/supabaseClient";

const AddQuote = ({
  initialQuoteText = "",
  initialAuthor = "",
  initialTags = "",
  defaultCollectionId = "",
  onClose,
}) => {
  const [quoteText, setQuoteText] = useState(initialQuoteText);
  const [author, setAuthor] = useState(initialAuthor);
  const [source, setSource] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState(defaultCollectionId);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState(initialTags);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("collection")
          .select("*")
          .eq("user_id", user.id);

        if (data) setCollections(data);
        else console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    setQuoteText(initialQuoteText);
    setAuthor(initialAuthor);
    setTags(initialTags);
    setSelectedCollectionId(defaultCollectionId);
  }, [initialQuoteText, initialAuthor, initialTags, defaultCollectionId]);

  useEffect(() => {
    const modalElement = document.getElementById("addQuoteModal");
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quoteText.trim()) {
      alert("Quote text is required.");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not found:", userError);
      alert("User not found.");
      return;
    }

    const userId = user.id;
    console.log("Authenticated user ID:", userId);

    let collectionId = selectedCollectionId;

    if (!selectedCollectionId && newCollectionName.trim()) {
      const { data: newCollection, error: collError } = await supabase
        .from("collection")
        .insert([{ title: newCollectionName.trim(), user_id: userId }])
        .select()
        .single();

      if (collError) {
        console.error("Failed to add new collection:", collError.message);
        alert("Error adding new collection.");
        return;
      }
      collectionId = newCollection.id;
    }

    const { data: quote, error: quoteError } = await supabase
      .from("quote")
      .insert([
        {
          text: quoteText,
          author: author || null,
          source: source || null,
          user_id: userId,
          collection_id: collectionId || null,
          tags: tags || null,
        },
      ])
      .select()
      .single();

    if (quoteError) {
      console.error("Error inserting quote:", quoteError.message);
      alert("Failed to add quote.");
      return;
    }

    console.log("Inserted quote:", quote);

    if (isFavorite && quote?.id) {
      const { error: favError } = await supabase
        .from("favorite")
        .insert([{ user_id: userId, quote_id: quote.id }]);

      if (favError) {
        console.error("Failed to add to favorites:", favError.message);
        alert("Failed to add to favorites.");
      }
    }

    setShowToast(true);
    setTimeout(() => {
      const modalElement = document.getElementById("addQuoteModal");
      let modalInstance = Modal.getInstance(modalElement);
      if (!modalInstance) modalInstance = new Modal(modalElement);
      modalInstance.hide();

      onClose();

      setQuoteText("");
      setAuthor("");
      setSource("");
      setSelectedCollectionId("");
      setNewCollectionName("");
      setIsFavorite(false);
    }, 800);

    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {/* Modal */}
      <div className="modal fade" id="addQuoteModal" tabIndex="-1" aria-labelledby="addQuoteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header justify-content-center position-relative">
              <h5 className="modal-title text-center w-100 fw-bold" id="addQuoteModalLabel">Add a New Quote</h5>
              <button type="button" className="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body px-5">
              <form onSubmit={handleSubmit}>
                {/* Quote Text */}
                <div className="mb-3">
                  <label htmlFor="quoteText" className="form-label text-start w-100">
                    Quote Text <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="quoteText"
                    rows="3"
                    required
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                  ></textarea>
                </div>

                {/* Author & Source */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="quoteAuthor" className="form-label text-start w-100">Author <em>(optional)</em></label>
                    <input
                      type="text"
                      className="form-control"
                      id="quoteAuthor"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="quoteSource" className="form-label text-start w-100">Source <em>(optional)</em></label>
                    <input
                      type="text"
                      className="form-control"
                      id="quoteSource"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    />
                  </div>
                </div>

                {/* Collections */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="quoteCollection" className="form-label text-start w-100">Collection</label>
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
                    <label htmlFor="newCollection" className="form-label text-start w-100">Add to New Collection</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newCollection"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tags & Favorite */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <label htmlFor="tags" className="form-label text-start w-100">Tags <em>(comma-separated)</em></label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-check ms-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="addToFavorite"
                        checked={isFavorite}
                        onChange={(e) => setIsFavorite(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="addToFavorite">
                        Add to Favorites
                      </label>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="text-center">
                  <button type="submit" className="btn btn-primary me-2">Save Quote</button>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="toast-container position-absolute top-50 start-50 translate-middle"
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
                Quote added successfully!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddQuote;
