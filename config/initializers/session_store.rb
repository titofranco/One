# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_tesis_session',
  :secret      => '2fc6296ddbe6f16c385d82d74d84858133fdd1233eea1ea66afbd61d743777158e694a67cfc7f75e5f4b9553014e1c3d17baac76bb0a16d84e36435c8ee2cd7b'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
