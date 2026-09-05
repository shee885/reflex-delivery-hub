# Reflex Delivery Hub

Build a complete working web app called **Reflex**, a simple delivery management system for small Kenyan retailers such as electronics shops, pharmacies, and hardware stores.

### Core idea

Reflex replaces WhatsApp/phone-based delivery coordination with one system:

**Retailer creates delivery → Dispatcher assigns rider → Rider updates status → Delivery is confirmed → Retailer sees completion.**

### User roles

Create 3 roles with separate dashboards:

**1. Retailer**

* Create delivery request
* View all their deliveries
* Search/filter deliveries
* See rider assigned and current status
* View proof of delivery

Delivery form:

* Customer name
* Customer phone (+254 format)
* Delivery address
* Item description
* Notes
* Priority

**2. Dispatcher**

* Dashboard showing:

  * Total deliveries
  * Pending
  * Unassigned
  * In Transit
  * Delivered
* View all deliveries
* Assign/reassign riders
* See rider availability
* Search/filter deliveries
* View delivery details and status history

**3. Rider**
Create a simple mobile-first dashboard showing assigned deliveries.

* Customer name and phone
* Delivery address
* Item
* Call customer button
* Navigate button
* Update status
* Confirm delivery

### Delivery workflow

Use these statuses:

**Pending → Assigned → Picked Up → In Transit → Delivered**

Also allow:

**Failed** and **Cancelled**

Every status change should show a timestamp in a delivery timeline.

### Proof of delivery

When a rider marks a delivery as Delivered:

* Ask for a 4-digit customer PIN
* Allow the rider to upload/take a delivery photo
* Record recipient name and delivery time

The delivery should only become **Delivered** after confirmation.

### QR scanning

Give every delivery a unique order number such as:

**RFX-00125**

Generate a QR code for each order.

Add a **Scan Order** feature for riders so they can scan the QR code and open the correct delivery.

### Realtime behavior

When possible, changes should update across dashboards without refreshing:

* New retailer request → appears for dispatcher
* Dispatcher assignment → appears for rider
* Rider status update → appears for dispatcher and retailer
* Completed delivery → appears as Delivered for retailer

### Customer tracking

Create a simple tracking page where someone can enter an order number such as **RFX-00125** and see:

* Customer/order
* Current status
* Rider
* Delivery address
* Status timeline

No customer account should be required.

### Design

Make Reflex modern, clean, friendly and professional.

Use:

* Primary: Deep teal **#0F766E**
* Secondary: Blue **#2563EB**
* Accent: Amber **#F59E0B**
* Background: **#F8FAFC**
* Dark text: **#0F172A**
* Green for Delivered
* Red for Failed/Cancelled

Use clean cards, rounded corners, simple icons, clear status badges and responsive layouts.

The rider dashboard must be especially easy to use on a phone.

Add a simple Reflex logo using a delivery/location concept.

Tagline:

**"Every delivery. Under control."**

### Navigation

**Retailer:**
Dashboard | New Delivery | Deliveries

**Dispatcher:**
Dashboard | Deliveries | Riders

**Rider:**
My Deliveries | Scan Order | History

### Demo data

Add realistic fictional Kenyan demo data:

Retailers:

* TechZone Electronics
* Afya Pharmacy
* BuildRight Hardware

Riders:

* Brian Otieno
* Kevin Mwangi
* Daniel Kamau
* John Kiptoo

Create at least 10 sample deliveries with different statuses.

### Authentication

Create a simple login page with role-based access.

Provide demo accounts:

Dispatcher: [dispatcher@reflex.demo](mailto:dispatcher@reflex.demo)
Retailer: [retailer@reflex.demo](mailto:retailer@reflex.demo)
Rider: [rider@reflex.demo](mailto:rider@reflex.demo)

Use one simple demo password for all accounts and display the credentials on the login page.

### Important

Build this as a **working MVP, not a static design**.

All main buttons, forms, status updates, assignment, QR generation/scanning, proof of delivery, filtering and navigation should work.

Keep the implementation simple and avoid unnecessary features.

Prioritize the core experience:

**CREATE → ASSIGN → TRACK → CONFIRM**

Build the entire application in one pass and make it ready to run and demonstrate.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/29001256-5fb2-4631-986e-7276790f6444).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
