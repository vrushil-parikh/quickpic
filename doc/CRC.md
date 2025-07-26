# **CRC Document**

---

| **Class: Customer** | |
|---------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Register/Login/Logout<br>Browse/Search Products<br>View/Edit Cart<br>Place Order<br>Track Order | Cart<br>Order<br>Product<br>Notification<br>Address |

---

| **Class: Admin** | |
|------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Manage Products<br>Manage Recipes<br>Send Reorder Notification<br>Manage Accounts<br>Manage Address | Product<br>Category<br>Sub Category<br>Recipe<br>Customer<br>Notification |

---

| **Class: Address** | |
|--------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Store Address Details | Admin |

---

| **Class: Payment** | |
|--------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Process Payment | Order |

---

| **Class: Category** | |
|----------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Categorized Products | Admin<br>Sub Category |

---

| **Class: Sub-Category** | |
|--------------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Further Organize Products | Category<br>Product<br>Admin |

---

| **Class: Product** | |
|---------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Store Product Details<br>Update Stock<br>Link to Category<br>Link to Sub-Category | Category<br>Sub Category<br>CartItem<br>Order<br>Admin<br>Recipe |

---

| **Class: Cart** | |
|------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Add/Remove/Update Item<br>Calculate Total | CartItem<br>Product<br>Customer |

---

| **Class: CartItem** | |
|----------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Get price of product with quantity | Product<br>Cart |

---

| **Class: Order** | |
|------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Track Order Status<br>Link to Payment<br>Store Ordered Product | Customer<br>Product<br>Payment |

---

| **Class: Recipe** | |
|-------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Store Instructions<br>Provide Required Ingredients | Product<br>Admin |

---

| **Class: Notification** | |
|--------------------------|------------------------------|
| **Responsibilities** | **Collaborations** |
| Send Message | Customer<br>Admin |
