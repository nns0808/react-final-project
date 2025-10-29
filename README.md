Book List App

Book List App is a React-based web application that helps users manage their personal reading collection. It allows adding, searching, sorting, editing, and rating books in a clean, intuitive interface — with data stored and synced using Airtable.

Features

⦁	Add New Books – Enter a book’s title, author, and optional details such as description and personal notes.
⦁	Edit Books – Update book information directly in the list with inline editing.
⦁	Search & Filter – Quickly find books by title using a responsive search field.
⦁	Sort Options – Sort your list by title, author, rating, or date added, in ascending or descending order.
⦁	Star Ratings – Rate each book with an interactive star rating system.
⦁	Pagination – Automatically organizes your list into pages for easy navigation.
⦁	Airtable Integration – Sync and persist your book data through the Airtable API.

Tech Stack

⦁	React (with Hooks) – Core UI and state management
⦁	
⦁	React Router – Navigation and page parameters
⦁	
⦁	Styled Components & CSS Modules – Modular, scoped styling
⦁	
⦁	JavaScript (ES6+) – Logic and functionality
⦁	
⦁	Airtable API – Backend and data storage


Main Components

Component	           Purpose
⦁	BookPage	Main container handling pagination, filtering, and sorting logic
⦁	BookForm	Adds new books to the list
⦁	BookList	Displays the list of books
⦁	BookListItem	Each book entry with edit, rating, and completion controls
⦁	BookViewForm	Handles search, sorting, and filtering options

Airtable API Setup

The Book List App uses Airtable as its backend database to store and sync book records.
1.Create an Airtable Base

Go to https://airtable.com
 and log in.
Choose the Create button at the bottom left and choose build an app on your on.
Name it Book.
Create a table Book.

2.Configure Your Table Fields

Your table should include the following fields:

Field Name      Field Type	          Description
title	       Single line text	     The book’s title
author	     Single line text	     The author’s name
about	       Long text	           Short description or summary
like	       Single line text	      Personal notes or favorite quotes
rating	     Number (1–5)	Star      rating for the book
isCompleted	 Checkbox	              Marks whether the book is finished
CreatedTime	 Created time	        Automatically stores when the record was added

3.Get Your API Credentials
 
Go to your Airtable account page,
Under Developer Hub → Personal Access Tokens, create a new token.

Give it read and write access to your workspace.

Copy your:  Personal Access Token

Base ID (from the URL or Airtable API docs)

Table Name (Book)

4.Add Credentials to .env.local

Create a file named .env.local in your project’s root directory (next to package.json):

VITE_PAT=your_personal_access_token_here
VITE_BASE_ID=your_airtable_base_id_here
VITE_TABLE_NAME=Book

5.Verify the Connection

When you start your app (npm run dev), the Book List App should automatically fetch and display your books from Airtable.
If you see no data or errors, double-check:

Field names match exactly (case sensitive)

Your token and base ID are correct

You granted the right permissions

