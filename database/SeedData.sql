INSERT  INTO Users (username, email, password, marketing_opt, role)
VALUES
('lara_whitley', 'lara.whitley@gmail.com', 'pass123', TRUE, 'User'),
('omar_hassan', 'omar.hassan@gmail.com', 'pass123', TRUE, 'User'),
('nourhan_hamada', 'nourhan.hamada@gmail.com', 'pass123', TRUE, 'Admin'),
('ahmed_samir', 'ahmed.samir@gmail.com', 'pass123', TRUE, 'User'),
('sara_khaled', 'sara.khaled@gmail.com', 'pass123', FALSE, 'User'),
('mohamed_adel', 'mohamed.adel@gmail.com', 'pass123', TRUE, 'User'),
('mira_soliman', 'mira.soliman@gmail.com', 'pass123', TRUE, 'User'),
('hassan_ali', 'hassan.ali@gmail.com', 'pass123', TRUE, 'User'),
('fatma_hussein', 'fatma.hussein@gmail.com', 'pass123', FALSE, 'User'),
('john_smith', 'john.smith@gmail.com', 'pass123', TRUE, 'User'),
('david_jackson', 'david.jackson@gmail.com', 'pass123', FALSE, 'User'),
('emily_clark', 'emily.clark@gmail.com', 'pass123', TRUE, 'User'),
('jennifer_brown', 'jennifer.brown@gmail.com', 'pass123', TRUE, 'User'),
('youssef_fathy', 'youssef.fathy@gmail.com', 'pass123', TRUE, 'User'),
('mariam_gamal', 'mariam.gamal@gmail.com', 'pass123', FALSE, 'User'),
('alaa_ismail', 'alaa.ismail@gmail.com', 'pass123', TRUE, 'User'),
('habiba_adel', 'habiba.adel@gmail.com', 'pass123', TRUE, 'User'),
('tarek_mostafa', 'tarek.mostafa@gmail.com', 'pass123', TRUE, 'User'),
('jana_samir', 'jana.samir@gmail.com', 'pass123', FALSE, 'User'),
('kareem_rashad', 'kareem.rashad@gmail.com', 'pass123', TRUE, 'User');

INSERT INTO ShippingAddress (UserID, Address, PostalCode, City, Country)
VALUES
(1, '12 Garden Street', '11511', 'Cairo', 'Egypt'),
(2, '45 Nile Avenue', '11321', 'Giza', 'Egypt'),
(3, '10 Freedom Road', '11765', 'Cairo', 'Egypt'),
(4, '88 Tahrir Square', '11522', 'Giza', 'Egypt'),
(5, '22 Palm Towers', '11330', 'Alexandria', 'Egypt'),
(6, '9 Lotus Compound', '11444', 'Cairo', 'Egypt'),
(7, '55 Horizon City', '11566', 'Cairo', 'Egypt'),
(8, '19 Corniche Rd', '21111', 'Alexandria', 'Egypt'),
(9, '77 Mountain View', '11355', 'Cairo', 'Egypt'),
(10,'5 Green Park', '11499', 'Cairo', 'Egypt'),
(11,'101 Lake View', '11821', 'Giza', 'Egypt'),
(12,'4 Sunset Valley', '11402', 'Cairo', 'Egypt'),
(13,'16 West Hills', '11378', 'Alexandria', 'Egypt'),
(14,'88 Sunrise District', '11588', 'Cairo', 'Egypt'),
(15,'33 Blue River', '11900', 'Cairo', 'Egypt'),
(16,'120 Island Road', '11392', 'Giza', 'Egypt'),
(17,'6 Marina Bay', '21122', 'Alexandria', 'Egypt'),
(18,'44 Ocean Drive', '11470', 'Cairo', 'Egypt'),
(19,'7 Maple Town', '11360', 'Giza', 'Egypt'),
(20,'11 Silver Heights', '11380', 'Cairo', 'Egypt');

DELIMITER $$

CREATE TRIGGER trg_payment_before_insert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    -- If payment is Cash, clear all card fields
    IF NEW.PaymentMethod = 'Cash' THEN
        SET NEW.CardholderName = NULL;
        SET NEW.CardNumber = NULL;
        SET NEW.ExpirationDate = NULL;
        SET NEW.CVC = NULL;
    ELSE
        -- For Credit/Debit, ensure card details are provided
        IF NEW.CardholderName IS NULL
           OR NEW.CardNumber IS NULL
           OR NEW.ExpirationDate IS NULL
           OR NEW.CVC IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Card details are required for non-cash payment methods';
        END IF;
    END IF;
END$$

DELIMITER ;
INSERT INTO Payment (UserID, PaymentMethod, CardholderName, CardNumber, ExpirationDate, CVC)
VALUES
(1, 'Cash', NULL, NULL, NULL, NULL),
(2, 'Cash', NULL, NULL, NULL, NULL),
(3, 'Cash', NULL, NULL, NULL, NULL),
(4, 'Cash', NULL, NULL, NULL, NULL),
(5, 'Cash', NULL, NULL, NULL, NULL),
(6, 'Cash', NULL, NULL, NULL, NULL),
(7, 'Cash', NULL, NULL, NULL, NULL),
(8, 'Cash', NULL, NULL, NULL, NULL),
(9, 'Cash', NULL, NULL, NULL, NULL),
(10, 'Cash', NULL, NULL, NULL, NULL),

(11, 'Credit', 'John Smith', '4111111111111111', '2027-08-01', '123'),
(12, 'Debit', 'David Jackson', '5500000000000004', '2026-11-01', '456'),
(13, 'Credit', 'Emily Clark', '4007000000027', '2028-02-01', '789'),
(14, 'Credit', 'Jennifer Brown', '6011000990139424', '2026-06-01', '321'),
(15, 'Debit', 'Youssef Fathy', '3530111333300000', '2027-09-01', '654'),
(16, 'Credit', 'Mariam Gamal', '4000056655665556', '2029-03-01', '987'),
(17, 'Debit', 'Alaa Ismail', '5105105105105100', '2026-12-01', '147'),
(18, 'Credit', 'Habiba Adel', '4111111111111129', '2028-07-01', '258'),
(19, 'Debit', 'Tarek Mostafa', '6011111111111117', '2027-01-01', '369'),
(20, 'Credit', 'Jana Samir', '3566002020360505', '2029-10-01', '159');
