import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; 

function AddQuote() {
  return (  
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
              Add a New Quote
            </h5>
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body px-5">
            <form>
              {/* Quote Text */}
              <div className="mb-3">
                <label htmlFor="quoteText" className="form-label text-start w-100">Quote Text <span className="text-danger">*</span></label>
                <textarea className="form-control" id="quoteText" rows="3" required></textarea>
              </div>

              {/* Author and Source */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="quoteAuthor" className="form-label text-start w-100">Author <em>(optional)</em></label>
                  <input type="text" className="form-control" id="quoteAuthor" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="quoteSource" className="form-label text-start w-100">Source <em>(optional)</em></label>
                  <input type="text" className="form-control" id="quoteSource" />
                </div>
              </div>

              {/* Collection and New Collection */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="quoteCollection" className="form-label text-start w-100">Collection <em>(optional)</em></label>
                  <select className="form-select" id="quoteCollection">
                    <option value="">Select existing collection...</option>
                    <option value="1">Inspiration</option>
                    <option value="2">Books</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="newCollection" className="form-label text-start w-100">Add to New Collection <em>(optional)</em></label>
                  <input type="text" className="form-control" id="newCollection" />
                </div>
              </div>

              {/* Add to Favorites Checkbox */}
              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="addToFavorite" />
                <label className="form-check-label text-start w-100" htmlFor="addToFavorite">
                  Add to Favorites
                </label>
              </div>

              {/* Action Buttons */}
              <div className="text-center">
                <button type="submit" className="btn btn-primary me-2">
                  Save Quote
                </button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuote;
