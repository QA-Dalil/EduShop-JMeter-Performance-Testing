<h1 align="center">EduShop JMeter Performance Testing</h1>
<p align="center"><strong>The New Customer Journey</strong></p>
<p align="center">10 customers · 4 random sort options · 2 shopping paths · 10 completed orders</p>
<p align="center">
  <img alt="Apache JMeter 5.6.3" src="https://img.shields.io/badge/Apache%20JMeter-5.6.3-D22128?style=for-the-badge" />
  <img alt="REST API testing" src="https://img.shields.io/badge/REST%20API-Performance%20Testing-1F6FEB?style=for-the-badge" />
  <img alt="CSV data driven" src="https://img.shields.io/badge/CSV-Data%20Driven-217346?style=for-the-badge" />
</p>
<p align="center">A data-driven load test of a first-time customer's shopping journey on EduShop.</p>
<p align="center">
  <a href="NewCustomer.jmx">Test plan</a> ·
  <a href="customers.csv">Test data</a> ·
  <a href="report/index.html">HTML report</a>
</p>

## Project at a glance

- **Load:** 10 threads, 10-second ramp-up, one iteration per customer.
- **Coverage:** registration through first order and logout, using a different CSV row for each customer.
- **Final run:** 140 JTL records, 0 failures, and 10 orders created with HTTP 201.

## Test flow

1. Register with a unique email; continue only when an access token is returned.
2. Load categories and the first product page as one measured home-page transaction.
3. Browse the CSV category using one randomly selected sort and select a product.
4. Run both shopping paths in random order: one opens product details and reviews before adding to the wishlist; the other searches and quick-adds an in-stock product to the cart.
5. Open the cart and checkout page, place an order using the CSV address and payment method, then log out.

The plan includes the required JMeter controllers, JSON extractors, assertions, timer, headers, CSV configuration, and pre/post processors. A Debug Sampler is available for troubleshooting and disabled during the measured run.

## Files

- [`NewCustomer.jmx`](NewCustomer.jmx) — runnable JMeter 5.6.3 plan.
- [`customers.csv`](customers.csv) — ten customer profiles and shopping choices.
- [`results.jtl`](results.jtl) — results from the verified load run.
- [`report/`](report/index.html) — complete JMeter HTML dashboard. Download the repository and open `report/index.html` in a browser.

## Run it yourself

1. Start the EduShop API from its [source repository](https://github.com/BayanAlhassoun/E-Commerce-test-project-for-API---JMeter---Automation) and confirm `http://localhost:5000/api/category` responds.
2. Before each run, use an Admin token to replenish product stock through `PUT /api/product/{id}`. The endpoint expects the full product body, so preserve its other values. Confirm that every category in `customers.csv` is active in the target database.
3. From this repository's root, run JMeter in non-GUI mode. Use a fresh output directory each time:

   ```powershell
   New-Item -ItemType Directory run-20261031
   jmeter -n -t NewCustomer.jmx -l run-20261031/results.jtl -e -o run-20261031/report
   ```

## Verified result

The local run on **31 October 2026** completed all ten customer journeys with **0 failures**. All ten registration, wishlist, quick-add, and logout requests succeeded; all ten orders returned HTTP 201. Registration and order placement had the highest mean times (1,568 ms and 1,061 ms); home-page load averaged 150 ms. These are observations from one small run, not capacity limits. The screenshots below come from that run's JMeter HTML report.

![JMeter dashboard showing 100% passing requests](figures/jmeter-dashboard.png)

![JMeter response-time percentiles](figures/jmeter-response-times.png)
