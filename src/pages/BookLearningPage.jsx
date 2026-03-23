import { useMemo, useState } from 'react';
import { BookMarked, Plus, Save, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BOOK_CATEGORY_OPTIONS, BOOK_STATUS_OPTIONS } from '../utils/constants';
import { formatShortDate } from '../utils/date';
import { createEmptyBookRecord } from '../utils/sampleData';
import { LineChart } from '../charts/LineChart';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

const longFormClass = 'textarea-control !min-h-[150px]';

export const BookLearningPage = () => {
  const { data, bookTrends, currentBook, learningStreak, saveBook, deleteRecord, createAgentFromBook } = useAppContext();
  const [form, setForm] = useState(createEmptyBookRecord());
  const [editingId, setEditingId] = useState(null);

  const completedBooks = useMemo(() => data.books.filter((book) => book.status === 'Completed').length, [data.books]);
  const readingBooks = useMemo(() => data.books.filter((book) => book.status === 'Reading').length, [data.books]);
  const averageRating = useMemo(() => {
    if (!data.books.length) return 0;
    return (data.books.reduce((total, book) => total + Number(book.bookRating || 0), 0) / data.books.length).toFixed(1);
  }, [data.books]);

  const handleField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    saveBook(form);
    setEditingId(form.id);
  };

  const handleEdit = (book) => {
    setForm({ ...book });
    setEditingId(book.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewBook = () => {
    setForm(createEmptyBookRecord());
    setEditingId(null);
  };

  const handleDelete = (bookId) => {
    deleteRecord('books', bookId);
    if (form.id === bookId) {
      handleNewBook();
    }
  };

  return (
    <div>
      <PageHeader
        actions={
          <Button onClick={handleNewBook} variant="secondary">
            <Plus className="h-4 w-4" />
            New Book
          </Button>
        }
        description="Track what you are reading, what it teaches you, and how those lessons change your operating system as a founder."
        title="Book Learning"
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Books Completed</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{completedBooks}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Finished books with captured notes and lessons.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Currently Reading</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{readingBooks}</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Books actively feeding your current thinking.</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Learning Streak</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{learningStreak} days</p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Average rating across the library: {averageRating}/10.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <LineChart
          backgroundColor="rgba(36, 159, 232, 0.18)"
          borderColor="#249fe8"
          data={bookTrends.booksCompleted}
          labels={bookTrends.labels}
          subtitle="Weekly count of books marked completed."
          title="Books Completed"
        />
        <LineChart
          backgroundColor="rgba(93, 224, 192, 0.18)"
          borderColor="#5de0c0"
          data={bookTrends.readingMinutesPerWeek}
          labels={bookTrends.labels}
          subtitle="Weekly reading minutes captured from Daily Execution."
          title="Reading Minutes per Week"
        />
        <LineChart
          backgroundColor="rgba(244, 166, 64, 0.18)"
          borderColor="#f4a640"
          data={bookTrends.learningStreak}
          labels={bookTrends.labels}
          subtitle="How many consecutive reading days were active at each weekly checkpoint."
          title="Learning Streak"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
        <Card className="p-6" id="book-form">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Book Database</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{editingId ? 'Edit book notes' : 'Add a new book'}</h2>
            </div>
            {editingId ? <span className="badge">Editing</span> : <span className="badge">New</span>}
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-control sm:col-span-2" onChange={(event) => handleField('bookTitle', event.target.value)} placeholder="Book Title" value={form.bookTitle} />
              <input className="input-control" onChange={(event) => handleField('author', event.target.value)} placeholder="Author" value={form.author} />
              <select className="select-control" onChange={(event) => handleField('category', event.target.value)} value={form.category}>
                {BOOK_CATEGORY_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <select className="select-control" onChange={(event) => handleField('status', event.target.value)} value={form.status}>
                {BOOK_STATUS_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <input className="input-control" min="0" onChange={(event) => handleField('pages', Number(event.target.value))} placeholder="Pages" type="number" value={form.pages} />
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Start Date</label>
                <input className="input-control" onChange={(event) => handleField('startDate', event.target.value)} type="date" value={form.startDate} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Finish Date</label>
                <input className="input-control" onChange={(event) => handleField('finishDate', event.target.value)} type="date" value={form.finishDate} />
              </div>
              <input
                className="input-control"
                max="600"
                min="0"
                onChange={(event) => handleField('dailyReadingMinutes', Number(event.target.value))}
                placeholder="Daily Reading Minutes"
                type="number"
                value={form.dailyReadingMinutes}
              />
              <input className="input-control" max="10" min="1" onChange={(event) => handleField('bookRating', Number(event.target.value))} placeholder="Book Rating (1-10)" type="number" value={form.bookRating} />
            </div>

            <div className="grid gap-4">
              <textarea className="textarea-control" onChange={(event) => handleField('keyLessons', event.target.value)} placeholder="Key Lessons" value={form.keyLessons} />
              <textarea className="textarea-control" onChange={(event) => handleField('favoriteQuotes', event.target.value)} placeholder="Favorite Quotes" value={form.favoriteQuotes} />
              <textarea className="textarea-control" onChange={(event) => handleField('actionableIdeas', event.target.value)} placeholder="Actionable Ideas" value={form.actionableIdeas} />
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-xs uppercase tracking-[0.25em] text-brand-500">Book Summary Notes</p>
              <div className="mt-4 space-y-4">
                <textarea className={longFormClass} onChange={(event) => handleField('summary', event.target.value)} placeholder="Summary" value={form.summary} />
                <textarea className={longFormClass} onChange={(event) => handleField('keyConcepts', event.target.value)} placeholder="Key Concepts" value={form.keyConcepts} />
                <textarea className={longFormClass} onChange={(event) => handleField('ideasToApply', event.target.value)} placeholder="Ideas to Apply" value={form.ideasToApply} />
                <textarea className={longFormClass} onChange={(event) => handleField('businessInsights', event.target.value)} placeholder="Business Insights" value={form.businessInsights} />
                <textarea className={longFormClass} onChange={(event) => handleField('personalReflection', event.target.value)} placeholder="Personal Reflection" value={form.personalReflection} />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button onClick={handleNewBook} type="button" variant="secondary">
                Reset
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4" />
                {editingId ? 'Update Book' : 'Save Book'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="panel-card-strong p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-600 dark:text-brand-200">Current Book Being Read</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{currentBook?.bookTitle || 'No active reading book'}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {currentBook ? `${currentBook.author} • ${currentBook.category}` : 'Pick a book and log it as Reading to keep the learning loop visible.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge">{currentBook?.status || 'Not started'}</span>
              {currentBook?.pages ? <span className="badge">{currentBook.pages} pages</span> : null}
              {currentBook?.dailyReadingMinutes ? <span className="badge">{currentBook.dailyReadingMinutes} min target</span> : null}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Book library</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Every book keeps its own notes, lessons, quotes, and applied ideas.</p>
              </div>
              <span className="badge">{data.books.length} books</span>
            </div>

            {data.books.length ? (
              <div className="mt-6 space-y-4">
                {data.books.map((book) => (
                  <div
                    className={`rounded-3xl border p-5 transition ${form.id === book.id ? 'border-brand-400 bg-brand-500/10 dark:border-brand-400' : 'border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/50'}`}
                    key={book.id}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{book.bookTitle}</h3>
                          <span className="badge">{book.status}</span>
                          <span className="badge">{book.category}</span>
                          <span className="badge">{book.bookRating}/10</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(book)} variant="secondary">
                          <BookMarked className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button onClick={() => createAgentFromBook(book)} variant="secondary">
                          Agent Seed
                        </Button>
                        <Button onClick={() => handleDelete(book.id)} variant="danger">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reading Window</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                          {book.startDate ? formatShortDate(book.startDate) : 'TBD'}
                          {' -> '}
                          {book.finishDate ? formatShortDate(book.finishDate) : 'In progress'}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pages / Daily Minutes</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{book.pages} pages • {book.dailyReadingMinutes} min</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 dark:bg-slate-900/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Actionable Ideas</p>
                        <p className="mt-2 line-clamp-3 text-sm text-slate-700 dark:text-slate-200">{book.actionableIdeas || 'No applied ideas captured yet.'}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Key Lessons</p>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{book.keyLessons || 'No lessons logged yet.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Favorite Quotes</p>
                        <p className="mt-2 text-sm italic text-slate-700 dark:text-slate-200">{book.favoriteQuotes || 'No quote captured yet.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Summary</p>
                        <p className="mt-2 line-clamp-4 text-sm text-slate-700 dark:text-slate-200">{book.summary || 'No summary written yet.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Business Insights</p>
                        <p className="mt-2 line-clamp-4 text-sm text-slate-700 dark:text-slate-200">{book.businessInsights || 'No business insight captured yet.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ideas to Apply</p>
                        <p className="mt-2 line-clamp-4 text-sm text-slate-700 dark:text-slate-200">{book.ideasToApply || 'No implementation notes yet.'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Personal Reflection</p>
                        <p className="mt-2 line-clamp-4 text-sm text-slate-700 dark:text-slate-200">{book.personalReflection || 'No reflection logged yet.'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState copy="Add books you are reading and capture the lessons that should shape how you build." title="No books yet" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
